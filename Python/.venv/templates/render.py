from jinja2 import Template
import pdfkit
from pypdf import PdfReader, PdfWriter
import os
from dotenv import load_dotenv
load_dotenv()
irr_data = [5.17, 5.96, 6.61, 7.14, 7.18, 5.68, 4.28, 4.25, 5.13, 5.75, 5.09, 4.64]
with open(os.environ.get('TEMPLATES_FOLDER') + 'industrialQuotationcopy.html') as f:
    rendered = Template(f.read()).render({
    "location" : "Gujarat",
"city": "Ahmedabad",
"quotation_type": "Industrial",
"agent_code": "BHV0001",
"agent_name": "Grace G. Green",
"consumer_name": "adarsh h patel",
"consumer_address": "Baroda,atladara",
"consumer_mobile_number": "0",
"consumer_email": "shantanu.wagh@bsre.in",
"solar_module_name": "SOLAR CITIZEN",
"solar_panel_type": "Mono Perc",
"number_of_panels": 12,
"solar_module_wattage": "4",
"solar_structure": "Hot dip galvanized structure",
"total_kilowatts": 0.048,
"solar_inverter_make": "Aarusha",
"inverter_capacity": 5,
"solar_cable": "Yes",
"switch_and_gear_protection_make": "Havells",
"sprinkler_installation": "Yes",
"rate_per_watt": 3,
"gst_per_watt": 5,
"electricity_unit_rate": 5,
"inflation_in_unit_rate": 2,
"is_loan": False,
"loan_amount_on_project": 0,
"loan_term": 60,
"interest_rate_on_loan": 0,
"reinvestment_rate": 7,
"any_extra_cost_on_add_on_work": 0,
"gst_on_add_on_work": 0,
"is_subsidy": False,
"subsidy_per_watt": 0,
"latitude": 23.0745,
"longitude": 72.624,

    "GRAPHS_FOLDER": os.environ.get("GRAPHS_FOLDER"),
    'irradiation_data': irr_data,
    "production_data": [i*30*0.54 for i in irr_data],
    "profit_data": [i*0.07*30*0.54 for i in irr_data],
    "production_degradation": [i*0.02*30*0.54 for i in irr_data],
    "earnings_degradation": [i*0.01*30*0.54 for i in irr_data],
    "breakeven": [i*0.01*30*0.54 for i in irr_data],
    "guvnl_amount": 0,
    "subsidy":1000,







    # "consumer_mobile_number": "0",
    # "consumer_address": "sfefsef",
    # "solar_module_wattage": 540,
    # "total_kilowatts": 3.24,
    # "number_of_panels": 6,
    # "subsidy": 45515,
    # "guvnl_amount": 180696,
    # "net_guvnl_system_price": 135181,
    # "discom_or_torrent": "DISCOM",
    # "phase": "Single",
    # "installation_ac_mcb_switch_charges": 500,
    # "geb_agreement_fees": 300,
    # "project_cost": 135981,
    # "quotation_type": "Residential",
    # "agent_code": "BHV0002",
    # "agent_name": "Henry H. Taylor",
    # "location": "Gujarat",
    # "structure": "4//8",
    # "mounting_quantity": "As Per Site",
    # "mounting_description": "As Per Site Condition",
    # "mounting_structure_make": "Hot Deep GI 80 Micron",
    # "solar_inverter_make": "Aarusha",
    # "solar_panel_type": "Mono Perc",
    # "solar_module_name": "SOLAR CITIZEN",
    # "consumer_name": "AEFAEf",
    # "consumer_email": "shantanu.wagh@bsre.in"
    })
with open(os.environ.get('TEMPLATES_FOLDER') + "my_new_file.html", "w") as fh:
    fh.write(rendered)

pdfkit.from_file(os.environ.get('TEMPLATES_FOLDER') + "my_new_file.html", os.environ.get('TEMPORARY_FILES_FOLDER') + 'temp.pdf', options={"enable-local-file-access": "", "--header-html": "file:///" + os.environ.get('TEMPLATES_FOLDER') + "header.html", 
                        "--footer-html": "file:///" + os.environ.get('TEMPLATES_FOLDER') + "footer.html"})
reader = PdfReader(os.environ.get('TEMPORARY_FILES_FOLDER') +'temp.pdf')
writer = PdfWriter()
writer.append_pages_from_reader(reader)