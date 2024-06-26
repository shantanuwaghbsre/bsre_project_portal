import base64
from flask import Blueprint, Flask, request, jsonify, send_file
import requests
from service import make_db_call
import datetime
from datetime import timezone
import pytz
from mailer import mail_to_consumer
import os
from dotenv import load_dotenv
load_dotenv()
import json

# Create a Blueprint object
blueprint = Blueprint('agents_routes', __name__)

ist = pytz.timezone('Asia/Kolkata')
gmt = pytz.timezone('GMT')

file_path = os.environ.get('QUERIES_FOLDER') + 'queries_for_agents.json'

try:
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            queries = json.load(file)
    else:
        print("File does not exist.")
except Exception as e:
    print("An error occurred:", str(e))



@blueprint.route('/getAgents', methods=['GET'])
def getAgents():
    """
    Get a list of agent details from the database.

    Returns:
        list: A list of dictionaries containing agent details. Each dictionary has the following keys:
            - agent_id (int): The ID of the agent.
            - agent_name (str): The name of the agent.
            - agent_mobile_number (str): The mobile number of the agent.
            - agent_address (str): The address of the agent.
            - agent_state (str): The state of the agent.

    """
    # Query the database to get agent details
    agent_details_list = make_db_call(query=queries['get_agents'], type_="returns")
    # Create a response list by iterating over each agent details
    response = [
        {
            
            "agent_code": agent_details[0],
            "agent_name": agent_details[1],
            "agent_mobile_number": str(agent_details[2]),
            "agent_address": agent_details[3],
            "agent_state": agent_details[4]
        }
        for agent_details in agent_details_list
    ]

    # Return the response list
    return response

@blueprint.route('/addAgent', methods=['POST'])
def addAgent():
    """
    Add an agent to the database.

    Returns:
        dict: A dictionary containing a message indicating the success or failure of the operation.

    """
    response = {}
    # Extract the values from the JSON payload
    last_agent_code = make_db_call(query=queries['get_last_agent_code'], type_="returns", parameters={"agent_branch": request.form['agent_branch']})[0][0]
    agent_code = str.format(last_agent_code[0:3] + '{0:04d}', (int(last_agent_code[3:]) + 1))
    # Insert the agent details into the database
    response['completed'] = make_db_call(query=queries['add_agent'], parameters={
        'agent_name': request.form["agent_name"],
        'agent_mobile_number': request.form["agent_mobile_number"],
        'agent_address': request.form["agent_address"],
        'agent_state': request.form["agent_state"],
        'agent_code': agent_code,
        'agent_branch': request.form['agent_branch'],
        'pan_card': request.files['pan_card'].read(),
        'aadhar_card': request.files['aadhar_card'].read(),
        'bank_branch_name': request.form['bank_branch_name'],
        'bank_ifsc': request.form['bank_ifsc'],
        'cancelled_cheque': request.files['cancelled_cheque'].read(),
    }, type_="insert")

    if response['completed'] == True:
        response['agent_code'] = agent_code

    return response

@blueprint.route('/getAgentSales', methods=['GET'])
def getAgentSales():
    agent_code = request.args.get('agent_code')
    if agent_code:
        sales = make_db_call(queries['get_agent_sales'], 'returns', parameters={'agent_code': agent_code})
        print(sales)
        response = { "sales": {
            "January":0,
            "February":0,
            "March":0,
            "April":0,
            "May":0,
            "June":0,
            "July":0,
            "August":0,
            "September":0,
            "October":0,
            "November":0,
            "December":0
            },
            "projects": {
                "January":[],
                "February":[],
                "March":[],
                "April":[],
                "May":[],
                "June":[],
                "July":[],
                "August":[],
                "September":[],
                "October":[],
                "November":[],
                "December":[]            
            }
        }
        if sales[0][0]:
            for item in sales:
                    response["sales"][item[1].strftime("%B")] += item[0]
                    response["projects"][item[1].strftime("%B")].append(item[2])

        return response


    return "Agent code not found"

@blueprint.route("/getAgentDetails", methods=["GET"])
def getAgentDetails():
    data = make_db_call(queries["get_agent_details"], "returns", parameters={"agent_code": request.args.get("agent_code")})
    response = {
        "agent_branch": data[0][0],
        "agent_name": data[0][1],
        "agent_state": data[0][2],
        "agent_code": data[0][3],
        "agent_mobile_number": data[0][4],
        "bank_ifsc": data[0][5],
        "bank_branch_name": data[0][6],
    }

    try:
        response["aadhar_card"]= base64.b64encode(data[0][7]).decode("utf-8"),
        response["pan_card"]= base64.b64encode(data[0][8]).decode("utf-8"),
        response["cancelled_cheque"]= base64.b64encode(data[0][9]).decode("utf-8") 
    except:
        response["aadhar_card"]= None
        response["pan_card"]= None
        response["cancelled_cheque"]= None

    return response