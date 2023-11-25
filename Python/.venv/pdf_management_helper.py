from jinja2 import Environment, FileSystemLoader
import os
import pdfkit
from pypdf import PdfReader, PdfWriter
import matplotlib.pyplot as plt
from dotenv import load_dotenv
load_dotenv()

def create_graph(X_data, Y_data, X_label, Y_label, color_, width_, title, filename, figsize_=(10, 8)):
    """
    Create and save a bar graph.

    Args:
        X_data (list): List of x-axis data points.
        Y_data (list): List of y-axis data points.
        X_label (str): Label for the x-axis.
        Y_label (str): Label for the y-axis.
        color_ (str): Color of the bars.
        width_ (float): Width of the bars.
        title (str): Title of the graph.
        filename (str): File name to save the graph.
        figsize_ (tuple, optional): Figure size. Defaults to (10, 8).
    """
    # Create the figure and axes
    fig, ax = plt.subplots(figsize=figsize_)

    # Set the x-axis tick labels and rotation
    ax.set_xticklabels(list(X_data), rotation=45, ha="right")

    # Create the bar plot
    plt.bar(X_data, Y_data, color=color_, width=width_)

    # Set the x-axis and y-axis labels
    plt.xlabel(X_label)
    plt.ylabel(Y_label)

    # Add the data values on top of the bars
    for i in range(len(X_data)):
        plt.text(i, Y_data[i] // 2, Y_data[i], ha='center')

    # Set the graph title
    plt.title(title)

    # Save the graph to a file
    plt.savefig(os.environ.get("GRAPHS_FOLDER") + filename)



def create_html_from_template(context):
    """
    Create an HTML file from a template.
    
    Args:
        context (dict): A dictionary containing the necessary values to render the template.
        
    Returns:
        str: The file path of the generated HTML file.
    """

    # Get the path to the templates folder from environment variable
    templates_folder = os.environ.get('TEMPLATES_FOLDER')
    
    # Get the necessary values from the context dictionary
    quotation_type = context["quotation_type"]
    quotation_number = context['quotation_number'].replace('/', '_')
    consumer_name = context['consumer_name']
    
    # Determine the template name based on the quotation type
    template_name = "residentialQuotation.html" if quotation_type == "Residential" else "industrialQuotation.html"
    
    # Generate a unique file path for the HTML file
    html_file_path = os.path.join(os.environ.get("TEMPORARY_FILES_FOLDER"), f"Quotation number {quotation_number} for {consumer_name}.html")
    
    # Create an environment for loading templates from the templates folder
    environment = Environment(loader=FileSystemLoader(templates_folder))
    
    # Get the template object based on the template path
    template = environment.get_template(template_name)
    
    # Open the HTML file in write mode and write the rendered template content
    with open(html_file_path, mode="w+", encoding="utf-8") as results:
        results.write(template.render(context))
        print(f"... wrote {html_file_path}")
    
    # Return the file path of the generated HTML file
    return html_file_path


def create_encrypted_pdf_from_html(html_file_path, context):
    """
    Create an encrypted PDF file from an HTML file.

    Args:
        html_file_path (str): The file path of the HTML file.
        context (dict): A dictionary containing the necessary values.

    Returns:
        None
    """
    # Set the path for the temporary PDF file
    temp_pdf_path = os.path.join(os.environ.get("TEMPORARY_FILES_FOLDER"), 'temp.pdf')

    # Convert the HTML file to a PDF file
    pdfkit.from_file(html_file_path, temp_pdf_path, options={"enable-local-file-access": ""})

    # Read the PDF file
    reader = PdfReader(temp_pdf_path)

    # Create a new PDF writer
    writer = PdfWriter()

    # Append the pages from the reader to the writer
    writer.append_pages_from_reader(reader)

    # Encrypt the PDF file using the last 4 digits of the quotation number and the consumer mobile number
    # writer.encrypt(context['quotation_number'][-4:]+'/'+str(context['consumer_mobile_number']))

    # Set the output PDF file path
    output_pdf_path = html_file_path.rstrip('.html') + '.pdf'

    # Write the output PDF file
    with open(output_pdf_path, "wb") as out_file:
        writer.write(out_file)

    # Remove the temporary PDF file and the HTML file
    os.remove(temp_pdf_path)
    os.remove(html_file_path)
