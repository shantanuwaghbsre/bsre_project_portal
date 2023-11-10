import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv
load_dotenv()

print(os.getenv('inquiry_email'))


def mail_to_consumer(inputs):
    inputs["quotation_number"] = inputs['quotation_number'].replace('/', '_')
# Email details
    from_email = os.getenv('FROM_EMAIL')
    subject = "Email with PDF Attachment"
    message_body = "This is the message body of the email."

    # Create a multipart message and set its parameters
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = inputs["consumer_email"]
    msg['Subject'] = subject

    # Attach the message body
    msg.attach(MIMEText(message_body, 'plain'))

    # Add PDF attachment
    filename = f"Quotation number {inputs['quotation_number']} for {inputs['consumer_name']}.pdf"
    attachment = open(filename, "rb")
    part = MIMEBase('application', 'octet-stream')
    part.set_payload((attachment).read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', "attachment; filename= %s" % filename)
    msg.attach(part)

    # Send the message via SMTP
    try:
        server = smtplib.SMTP_SSL(os.getenv('SSL_HOST'), os.getenv('SSL_PORT'))
        server.login(from_email, os.getenv('FROM_EMAIL_PASSWORD'))  # Enter your password here
        text = msg.as_string()
        server.sendmail(from_email, inputs["consumer_email"], text)
        server.quit()  
        return(["Email sent successfully.", filename])
    except Exception as e:
        raise e
        # return("Error: unable to send email:", e)