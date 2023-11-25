from jinja2 import Template
import pdfkit
from pypdf import PdfReader, PdfWriter
import os
from dotenv import load_dotenv
load_dotenv()
irr_data = [5.17, 5.96, 6.61, 7.14, 7.18, 5.68, 4.28, 4.25, 5.13, 5.75, 5.09, 4.64]
with open(os.environ.get('TEMPLATES_FOLDER') + 'industrialQuotation.html') as f:
    rendered = Template(f.read()).render({
    "state_or_territory": "Gujarat",
    "quotation_type": "Industrial",
    "agent_code": "VAD0002",
    "agent_name": "A2. B. CDE",
    "consumer_name": "AEFAEf",
    "consumer_address": "asefef",
    "consumer_mobile_number": "0234652445",
    "consumer_email": "shantanu.wagh@bsre.in",
    "solar_module_name": "BSIT",
    "solar_panel_type": "Mono Perc",
    "number_of_panels": 6,
    "solar_module_wattage": 540,
    "total_kilowatts": 3.24,
    "solar_inverter_make": "K SOLAR",
    "number_of_inverters": 2,
    "grid_tie_inverter_make": "Sun Grow",
    "number_of_grid_tie_inverters": 2,
    "solar_cable": "Yes",
    "switch_and_gear_protection_make": "Havells",
    "sprinkler_installation": "Yes",
    "rate_per_watt": 50,
    "gst_per_watt": 20,
    "electricity_unit_rate": 8,
    "inflation_in_unit_rate": 0,
    "is_loan": False,
    "loan_amount_on_project": 0,
    "loan_term": 60,
    "interest_rate_on_loan": 0,
    "reinvestment_rate": 7,
    "any_extra_cost_on_add_on_work": 10000,
    "gst_on_add_on_work": 2000,
    "is_subsidy": True,
    "subsidy_per_watt": 5,
    "GRAPHS_FOLDER": os.environ.get("GRAPHS_FOLDER"),
    'irradiation_data': irr_data,
    "production_data": [i*30*0.54 for i in irr_data],
    "profit_data": [i*0.07*30*0.54 for i in irr_data]
    })
with open(os.environ.get('TEMPLATES_FOLDER') + "my_new_file.html", "w") as fh:
    fh.write(rendered)

pdfkit.from_file(os.environ.get('TEMPLATES_FOLDER') + "my_new_file.html", os.environ.get('TEMPORARY_FILES_FOLDER') + 'temp.pdf', options={"enable-local-file-access": ""})
# reader = PdfReader(os.environ.get('TEMPORARY_FILES_FOLDER') +'temp.pdf')
# writer = PdfWriter()
# writer.append_pages_from_reader(reader)