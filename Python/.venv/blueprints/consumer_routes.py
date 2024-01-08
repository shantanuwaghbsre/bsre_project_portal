from flask import Blueprint, Flask, request, jsonify, send_file
from service import make_db_call
import datetime
from datetime import timezone
from io import BytesIO
from pdf_management_helper import create_encrypted_pdf_from_html, create_html_from_template, create_bar_graph, create_line_graph
from mailer import mail_to_consumer
import os
from dotenv import load_dotenv
load_dotenv()
import json
import re
import base64

# Create a Blueprint object
blueprint = Blueprint('customer_routes', __name__)
file_path = os.environ.get('QUERIES_FOLDER') + 'queries_for_customers.json'

try:
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            queries = json.load(file)
    else:
        print("File does not exist.")
except Exception as e:
    print("An error occurred:", str(e))


@blueprint.route('/onboardConsumer', methods=['POST'])
def onboardConsumer():
    # print(type(request.files["passportPhoto"].read()))
    # print(["files - " + i for i in request.files])
    # print("form - ", request.form)

    make_db_call(queries["insert_consumer"], type_="insert", 
    parameters={
    "consumer_name":request.form["consumerName"],
    "consumer_address":request.form["consumerAddress"],
    "consumer_mobile_number":request.form["consumerMobileNumber"],
    "alternate_phone_number":request.form["alternatePhoneNumber"],
    "consumer_email":request.form["consumerEmail"],
    "aadhar_card_number":request.form["aadharCardNumber"],
    "pan_card_number":request.form["panCardNumber"],
    "onboarded_by_agent_code":request.form["onboardedByAgentCode"],
    "aadhar_card":request.files["aadharCard"].read(),
    "passport_photo":request.files["passportPhoto"].read(),
    "pan_card":request.files["panCard"].read(),
    "other_document":request.files["otherDocument"].read(),
    })
    return {"success": True}

@blueprint.route('/getConsumerDocuments', methods=['GET'])
def getConsumerDocuments():
    if not re.match(r'^[a-z_]+$', request.args["document_required"]):
        raise ValueError("Document name should only contain alphabets and underscores.")
    data = make_db_call(queries["get_document"].replace("$document_name", request.args["document_required"]), 'select', parameters={"document_required": request.args["document_required"], "consumer_id": request.args["id"]})
    return {"document": base64.b64encode(bytes(data[0][0])).decode('utf-8')}

@blueprint.route('/getConsumerDetails', methods=['GET'])
def getConsumerDetails():
    return make_db_call(queries["get_consumer_details"], 'select', parameters={"consumer_id": request.args["consumer_id"]})[0][0]

@blueprint.route('/getAllConsumers', methods=['GET'])
def getAllConsumers():
    
    page = int(request.args.get('page'))
    limit = int(request.args.get('limit'))
    
    # Calculate the total number of pages based on the limit
    total_pages = int(make_db_call(query=queries['countPages'], type_='select')[0][0])// limit + 1
    
    # Get the consumers for the current page
    consumers_list = make_db_call(queries["get_all_consumers_list"], 'select', parameters={"lower": (limit*(page-1)), "limit": limit})
    
    # Check if there are no consumers for the current page
    if consumers_list == [[None]]:
        # Return an empty list of consumers and total pages as 0
        return {"consumers": [], "totalPages": 0}
    
    # Process the consumers query results and create a list of consumers
    consumers = []
    for row in consumers_list:
        # Create a dictionary for each consumer with the specified fields
        consumer = {
            "consumer_name": row[0],
            "consumer_address": row[1],
            "consumer_mobile_number": row[2],
            "consumer_id": row[3],
            "alternate_phone_number": row[4],
            "consumer_email": row[5],
            "aadhar_card_number": row[6],
            "pan_card_number": row[7],
            "aadhar_card": base64.b64encode(bytes(row[8])).decode('utf-8'),
            "pan_card": base64.b64encode(bytes(row[9])).decode('utf-8'),
            "passport_photo": base64.b64encode(bytes(row[10])).decode('utf-8'),
            "other_document": base64.b64encode(bytes(row[11])).decode('utf-8'),
            "onboarded_by_agent_code": row[12],

        }
        # Add the consumer to the list
        consumers.append(consumer)
    
    # Create the response dictionary with the consumers and total pages
    response = {
        "consumers": consumers,
        "totalPages": total_pages
    }
    # Return the response
    return response
    