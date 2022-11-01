from typing import final
import requests
from datetime import datetime
from datetime import date
import smtplib
import os
from dotenv import load_dotenv
import time
import schedule
from web3 import Web3
import json

load_dotenv()

# Contract setup
alchemy_url = "https://polygon-mumbai.g.alchemy.com/v2/ALbcNieoFrIRYYNDrcr4dAASXUCZbm-i"
web3 = Web3(Web3.HTTPProvider(alchemy_url))
nominee_factory = "0x30C281B4774DDEA05AE49395c12bFfbe6248136F"
file = open("Nominee.json")
abi = json.load(file)
contract = web3.eth.contract(address=nominee_factory, abi=abi)

# Function to get transaction details from api, get contract details
def getTransactionDetails():
    data = contract.functions.getOwners().call()
    # print(data)
    for i in range(len(data)):
        print(data[i])
        url = "https://deep-index.moralis.io/api/v2/"+data[i]+"?chain=mumbai"
        # print(url)
        headers = {"accept": "application/json", "X-API-Key": "test"}
        response = requests.get(url, headers=headers)
        json_data = response.json()
        last_transaction = json_data["result"][0]["block_timestamp"]
        # print(last_transaction)
        trans_month = last_transaction[5:7]
        trans_year = last_transaction[:4]
        trans_date = last_transaction[8:10]
        temp = date(int(trans_year), int(trans_month), int(trans_date))
        today = date.today()
        # print(today)
        difference = str(today - temp)
        # print(difference)
        no_days = difference.split(" ")[0]    
        if (no_days == "0:00:00") :
            no_days= 0
        # print(no_days)

        #get email of owner from contract
        data1 = contract.functions.getOwnerDetails(data[i]).call()
        email = (data1[1])

        #get email of nominees
        data2 = contract.functions.getNominees(data[i]).call()
        
        #get response date and response from contract
        response_date = contract.functions.getResponseDate(data[i]).call()
        final_resposne = contract.functions.getResponse(data[i]).call()
        if (response_date==""):
            print("no res date")
            no_res_days=0
        else:    
            # checking for 1 month 
            res_month = response_date[5:7]
            res_year = response_date[:4]
            res_date = response_date[8:]
            print((response_date))
            temp_date = date(int(res_year), int(res_month), int(res_date))
            today_date = date.today()
            # print(today)
            difference_date = str(today_date - temp_date)
            no_res_days = difference_date.split(" ")[0]    
            # print(no_res_days)
            if (no_res_days == "0:00:00") :
                no_res_days= 0
            print(no_res_days)
        
        if int(no_days) <180 and int(no_res_days)<30 and final_resposne==False:
            if response_date=="":
                print("call contract function")
                setDate(data[i])
                print("called")
            message = "Please tell me you are doing fine"
            sendMail(message,email)
        elif int(no_days)<180 and int(no_res_days)>30 and final_resposne==False:
            print("more than 1 month")
            nominee_email = []
            for i in range(len(data2)):
                data3 = contract.functions.getNomineeDetails(data2[i]).call()
                nominee_email.append(data3[2])
                message = "Hi, Congratulations you are nominated for cryptos!"
                sendMail(message,data3[2])
            print(nominee_email)
        elif int(no_days)>180:
            print("Active Account!")
        else:
            print("responded!")

def setDate(owner):
    chain_id = 80001
    my_address = os.environ.get("ADDRESS")
    private_key = os.environ.get("KEY")
    nonce = web3.eth.getTransactionCount(my_address)
    nonce = web3.eth.getTransactionCount(my_address)
    today_date = str(date.today())
    store_transaction = contract.functions.setResponseDate(owner,today_date).buildTransaction(
        {
            "chainId": chain_id,
            "from": my_address,
            "nonce": nonce,
            "gasPrice": web3.eth.gas_price,
        }
    )

    signed_store_txn = web3.eth.account.sign_transaction(
        store_transaction, private_key=private_key
    )
    send_store_tx = web3.eth.send_raw_transaction(signed_store_txn.rawTransaction)
    print(send_store_tx)

    tx_receipt = web3.eth.wait_for_transaction_receipt(send_store_tx)
    print(tx_receipt)
    return

# Function to send mail
def sendMail(message,email):
    
    # creates SMTP session
    smtp = smtplib.SMTP("smtp.gmail.com", 587)

    # start TLS for security
    smtp.starttls()

    # Authentication
    smtp.login(os.environ.get("APP_MAIL"), os.environ.get("APP_PASSWORD"))    
    smtp.sendmail(
        os.environ.get("APP_MAIL"), email, message
    )
    smtp.quit()    


getTransactionDetails()


# def sayHi():
#     print("yesssssssssssssss")


# schedule.every().minutes.do(getTransactionDetails)

# while True:
#     schedule.run_pending()
#     time.sleep(1)