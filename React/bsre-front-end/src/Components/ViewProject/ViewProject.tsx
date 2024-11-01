import axios from "axios";
import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  InputLabel,
  FormControl,
  Button,
  TextField,
  Paper,
  MenuItem,
  Select,
  TableContainer,
  TableHead,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import CheckBox from "@mui/material/Checkbox";
import MultiStepProgressBar from "../MultiStepProgressBar/MultiStepProgressBar";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";

const ViewProject = (props: any) => {
  axios.defaults.headers.common["token"] = props.token;
  const navigate = useNavigate();
  const urls = {};
  const [options, setOptions] = useState([
    { label: "Property Tax", value: "property_tax" },
    { label: "Electricity Bill", value: "electricity_bill" },
    { label: "Cancelled Cheque", value: "cancelled_cheque" },
  ]);
  const phase_2_discom_options = [
    { key_: "DGVCL", label: "Dakshin Gujarat Vij Company Limited" },
    { key_: "MGVCL", label: "Madhya Gujarat Vij Company Limited" },
    { key_: "PGVCL", label: "Paschim Gujarat Vij Company Limited" },
    { key_: "UGVCL", label: "Uttar Gujarat Vij Company Limited" },
    { key_: "Torrent_(Surat)", label: "Torrent Power Limited (Surat)" },
    { key_: "Torrent_(Ahmedabad)", label: "Torrent Power Limited (Ahmedabad)" },
  ];
  const [phase_8_document_options, setPhase_8_document_options] = useState([
    { key_: "agreement_residential", label: "Residential Agreement" },
    { key_: "agreement_industrial", label: "Industrial Agreement" },
    { key_: "vendoragreement_residential", label: "Vendor Agreement" },
    { key_: "certificate_1", label: "One Page Self Certificate" },
    { key_: "certificate_4", label: "Four Page Self Certificate" },
  ]);

  let location = useLocation();
  const [documentRequired, setDocumentRequired] = useState<string>("");
  const [project, setProject] = useState<{
    [key: string]: { [key: string]: any };
  }>({
    phase_1: {
      property_tax: new Blob(),
      electricity_bill: new Blob(),
      cancelled_cheque: new Blob(),
      other_documents: [],
      other_documents_names: [],
      meter_number: "",
      current_sanctioned_load: "",
      average_consumption_of_unit: "",
      consumer_number: "",
      consumer_name: "",
      other_document: "",
      project_type: "",
      project_address: "",
      latitude: "",
      longitude: "",
      total_kilowatts: "",
      solar_panel_type: "",
      project_cost: "",
      deposit_amount: "",
      remaining_balance: "",
      deposited_money_in_words: "",
      payment_type: "",
      transaction_number: "",
      bank_details_with_branch: "",
      national_portal_registration_number: "",
      current_phase: "",
      installation_phase: "",
      location: "",
      solar_inverter_make: "",
      solar_module_wattage: "",
      number_of_panels: "",
    },
    phase_2: {
      consumer_number: "",
      discom: "",
      discom_approval: "",
      notes: "",
    },
    phase_3: {
      consumer_number: "",
      notes: "",
      client_approved_cad: "",
    },
    phase_4: {
      consumer_number: "",
      notes: "",
      structure_ready: "",
    },
    phase_5: {
      consumer_number: "",
      notes: "",
      ready_to_transport: "",
    },
    phase_6: {},
    phase_7: {
      consumer_number: "",
      notes: "",
      geda_approval: "",
      electrical_diagram: new Blob(),
    },
    phase_8: {
      consumer_number: "",
      project_agreement: new Blob(),
      vendor_agreement: new Blob(),
      one_page_certificate: new Blob(),
      four_page_certificate: new Blob(),
    },
    phase_9: {
      consumer_number: "",
      meter_report: new Blob(),
      joint_inspection: new Blob(),
    },
    phase_10: {
      consumer_number: "",
      invoice_from_accounts: new Blob(),
      dcr: "",
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [editable, setEditable] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [file, setFile] = useState<File>();
  const [newNote, setNewNote] = useState("");
  const [fileChoice, setFileChoice] = useState(["", ""]);

  const [agreementValues, setAgreementValues] = useState<{
    [key: string]: any;
  }>({});
  const [vendorAgreementValues, setVendorAgreementValues] = useState<{
    [key: string]: any;
  }>({});
  const [onePageCertificateValues, setOnePageCertificateValues] = useState<{
    [key: string]: any;
  }>({});
  const [fourPageCertificateValues, setFourPageCertificateValues] = useState<{
    [key: string]: any;
  }>({});
  const [dcrValues, setDcrValues] = useState<{ [key: string]: any }>({});
  let newOptions = [];
  const inputOptions = {
    agreement: ["letter_date", "voltage"],
    vendorAgreement: [],
    onePageCertificate: [],
    fourPageCertificate: [],
    dcr: ["", ""],
  };

  useEffect(() => {
    // console.log(project.phase_1.solar_panel_type)
    try {
      if (location.state.consumer_number) {
        // console.log("location.state - ", location.state)
        setCurrentPage(location.state.project_in_phase);
        try {
          axios
            .get(
              import.meta.env.VITE_BACKEND_URL +
                `/getProject?consumer_number=${location.state.consumer_number}`
            )
            .then((response) => {
              // console.log(response.data);
              setProject(response.data);
              if (response.data.phase_1.project_type == "Residential") {
                setPhase_8_document_options([
                  ...phase_8_document_options.filter(
                    (option) => option.key_ != "agreement_industrial"
                  ),
                ]);
              } else {
                setPhase_8_document_options([
                  ...phase_8_document_options.filter(
                    (option) =>
                      option.key_ != "agreement_residential" &&
                      option.key_ != "vendor_agreement"
                  ),
                ]);
              }
              // console.log(response.data);
              setIsLoading(false);
              setCurrentPage(Number(response.data.phase_1.project_in_phase));
              for (
                let i = 0;
                i < response.data.phase_1["other_documents_names"].length;
                i++
              ) {
                // console.log(newOptions);
                newOptions.push({
                  label: response.data.phase_1["other_documents_names"][i],
                  value: response.data.phase_1["other_documents_names"][i],
                });
              }
              // console.log(newOptions);
              if (options.length == 3) {
                setOptions(options.concat(newOptions));
              }
            });
        } catch (error) {
          console.error(error);
        }
      } else {
        //From ViewAgentPage by Usenavigate
        console.log("Agent location.state - ", location.state);
        setCurrentPage(location.state.project_in_phase);
        try {
          axios
            .get(
              import.meta.env.VITE_BACKEND_URL +
                `/getProject?agent_id=${location.state.agent_id}`
            )
            .then((response) => {
              // console.log(response.data);
              // setProject(response.data);
              // if (response.data.phase_1.project_type == "Residential") {
              //   setPhase_8_document_options([
              //     ...phase_8_document_options.filter((option) => option.key_ != "agreement_industrial"),
              //   ])
              // }
              // else {
              //   setPhase_8_document_options([
              //     ...phase_8_document_options.filter((option) => option.key_ != "agreement_residential" && option.key_ != "vendor_agreement"),
              //   ])
              // }
              // console.log(response.data);
              setIsLoading(false);
              // setCurrentPage(Number(response.data.phase_1.project_in_phase));
              // for (let i = 0; i < response.data.phase_1["other_documents_names"].length; i++) {
              //   // console.log(newOptions);
              //   newOptions.push({ label: response.data.phase_1["other_documents_names"][i], value: response.data.phase_1["other_documents_names"][i] });
              // }
              // // console.log(newOptions);
              // if (options.length == 3) {
              //   setOptions(options.concat(newOptions));
              // }
            });
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (project.phase_2) {
      setVendorAgreementValues({
        ...vendorAgreementValues,
        discom: project.phase_2.discom || "",
        consumer_name: project.phase_1.consumer_name,
        consumer_number: project.phase_1.consumer_number,
        project_address: project.phase_1.project_address,
        total_kilowatts: project.phase_1.total_kilowatts,
        solar_module_wattage: project.phase_1.solar_module_wattage,
        solar_module_wattage_in_kw: project.phase_1.solar_module_wattage / 1000,
        total_cost: project.phase_1.project_cost,
      });
      setAgreementValues({
        ...agreementValues,
        discom: project.phase_2.discom || "",
        consumer_name: project.phase_1.consumer_name,
        consumer_number: project.phase_1.consumer_number,
        project_address: project.phase_1.project_address,
        total_kilowatts: project.phase_1.total_kilowatts,
      });
      setDcrValues({
        ...dcrValues,
        consumer_name: project.phase_1.consumer_name,
        project_address: project.phase_1.project_address,
        total_kilowatts: project.phase_1.total_kilowatts,
        registration_number:
          project.phase_1.national_portal_registration_number,
        discom: project.phase_2.discom,
        solar_panel_wattage: project.phase_1.solar_panel_wattage,
        number_of_panels: project.phase_1.number_of_panels,
      });
    }
  }, [project.phase_1, project.phase_2]);

  useEffect(() => {
    if (location.state.for_consumer_id && !project.phase_1.consumer_name) {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +
            `/getConsumerDetails?consumer_id=${location.state.for_consumer_id}`
        )
        .then((response_consumer_details) => {
          // console.log("consumer details", response_consumer_details);
          setProject((prevProject) => {
            // Retrieve the dictionary you want to modify
            const dictToUpdate = prevProject.phase_1 || {};

            // Create a copy of the dictionary
            const updatedDict = { ...dictToUpdate };

            // Set the desired key and value within the copied dictionary
            updatedDict.consumer_name = response_consumer_details.data;

            // Update the state variable with the modified dictionary
            return { ...prevProject, phase_1: updatedDict };
          });
          // console.log(project.phase_1)
        });
    }
  }, [location?.state?.for_consumer_id, project?.phase_1?.consumer_name]);
  // if(!project.phase_1.consumer_name.length) {
  //   axios.get(import.meta.env.VITE_BACKEND_URL + `/getConsumerDetails?consumer_id=${location.state.for_consumer_id}`).then(
  //   (response_consumer_details) => {
  //     console.log("consumer details", response_consumer_details.data);
  //     setProject((prevProject) => {
  //       // Retrieve the dictionary you want to modify
  //       const dictToUpdate = prevProject.phase_1 || {};

  //       // Create a copy of the dictionary
  //       const updatedDict = { ...dictToUpdate };

  //       // Set the desired key and value within the copied dictionary
  //       updatedDict.consumer_name = response_consumer_details.data;

  //       // Update the state variable with the modified dictionary
  //       return { ...prevProject, phase_1: updatedDict };
  //     });
  //     console.log(project.phase_1)
  //   });}

  const handleEditable = (page: number) => {
    setEditable((prevEditable) => {
      const newEditable = [...prevEditable];
      newEditable[page - 1] = !newEditable[page - 1];
      return newEditable;
    });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error("Function not implemented.");
  }

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Number(prevPage) - 1);
    setEditable([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    // throw new Error('Function not implemented.');
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Number(prevPage) + 1);
    setEditable([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    // throw new Error('Function not implemented.');
  };

  const promoteToNextPhase = () => {
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/promoteToNextPhase", {
        consumer_number: project.phase_1.consumer_number,
        project_in_phase: project.phase_1.project_in_phase,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          setCurrentPage((prevPage) => Number(prevPage) + 1);
          setEditable([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ]);
          axios
            .get(
              import.meta.env.VITE_BACKEND_URL +
                `/getProject?consumer_number=${project.phase_1.consumer_number}`
            )
            .then((response_project) => {
              console.log(response_project);
              setProject(response_project.data);
              setIsLoading(false);
            });
        }
      });
  };

  function handleInputChange(key: string, value: any): void {
    console.log("handleInputChange===>", key, value, project);
    if (value == undefined) {
      value = "";
    }
    if (key == "notes") {
      setProject((prevProject) => ({
        ...prevProject,
        ["phase_" + currentPage]: {
          ...prevProject["phase_" + currentPage],
          [key]:
            project["phase_" + currentPage][key] === null
              ? value
              : project["phase_" + currentPage][key] + "\n\n" + value,
        },
      }));
      setNewNote("");
    } else {
      setProject((prevProject) => ({
        ...prevProject,
        ["phase_" + currentPage]: {
          ...prevProject["phase_" + currentPage],
          [key]: value,
        },
      }));
      console.log(project);
    }
  }

  function handleSave(currentPage: number): void {
    if (currentPage == project.phase_1.project_in_phase) {
      console.log("handle save reached");
      const postObject = new FormData();
      for (const [key, value] of Object.entries(
        project["phase_" + currentPage]
      )) {
        postObject.append(key, value);
      }
      postObject.append("consumer_number", project.phase_1.consumer_number);
      postObject.append("project_in_phase", project.phase_1.project_in_phase);

      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/updatePhaseData", postObject)
        .then((response) => {
          console.log(response);
          toast.success("Data saved successfully");
        });
    } else {
      // check rights and add approval logic
      console.log("handle save reached for non current phase");
      const postObject = new FormData();
      for (const [key, value] of Object.entries(
        project["phase_" + currentPage]
      )) {
        postObject.append(key, value);
      }
      postObject.append("consumer_number", project.phase_1.consumer_number);
      postObject.append("project_in_phase", currentPage.toString());

      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/updatePhaseData", postObject)
        .then((response) => {
          console.log(response);
          toast.success("Data saved successfully");
        });
    }

    setEditable([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  }

  function handleDownload(
    documentRequired_: string,
    documentType: string
  ): void {
    console.log("documentRequired ", documentRequired_);
    let blob = new Blob([]);
    let base64String = "";
    console.log(project["phase_" + currentPage], documentRequired_);
    let url = import.meta.env.VITE_BACKEND_URL;
    if (
      documentRequired_ === "electrical_diagram" ||
      documentRequired_ === "meter_report" ||
      documentRequired_ === "joint_inspection" ||
      documentRequired_ === "property_tax" ||
      documentRequired_ === "electricity_bill" ||
      documentRequired_ === "cancelled_cheque"
    ) {
      console.log("in if 1");
      if (
        (project["phase_" + currentPage][documentRequired_] != false &&
          typeof project["phase_" + currentPage][documentRequired_] ==
            "string") ||
        (project["phase_" + currentPage][documentRequired_] != null &&
          typeof project["phase_" + currentPage][documentRequired_] == "object")
      ) {
        console.log(
          "in if 2 because",
          project["phase_" + currentPage][documentRequired_] != false,
          project["phase_" + currentPage][documentRequired_] != null
        );
        base64String = project["phase_" + currentPage][documentRequired_];
      } else if (
        project.phase_1.other_documents_names.includes(documentRequired_)
      ) {
        base64String =
          project.phase_1.other_documents[
            project.phase_1.other_documents_names.indexOf(documentRequired_)
          ];
      }
      try {
        // Decode the Base64 string to binary data
        const binaryString = atob(base64String);

        // Convert the binary string to a Uint8Array
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          uint8Array[i] = binaryString.charCodeAt(i);
        }

        // Create a Blob from the Uint8Array
        blob = new Blob([uint8Array]);
        console.log("blob was made in the right place");
      } catch (error) {
        console.error("Error decoding base64 string:", error);
      }
    } else {
      url += `/downloadFile?document_required=${documentRequired_}&document_type=${documentType}`;
      if (documentRequired_ === "agreement") {
        for (let i in agreementValues) {
          url += `&${i}=${agreementValues[i]}`;
        }
      } else if (documentRequired_ === "certificate") {
        if (documentType === "1") {
          for (let i in onePageCertificateValues) {
            url += `&${i}=${onePageCertificateValues[i]}`;
          }
        } else if (documentType === "4") {
          for (let i in fourPageCertificateValues) {
            url += `&${i}=${fourPageCertificateValues[i]}`;
          }
        }
      } else if (documentRequired_ === "dcr") {
        for (let i in dcrValues) {
          url += `&${i}=${dcrValues[i]}`;
        }
      } else if (documentRequired_ === "vendoragreement") {
        for (let i in vendorAgreementValues) {
          url += `&${i}=${vendorAgreementValues[i]}`;
        }
      }
    }
    console.log(url);
    if (url.match(/\&/g) != null) {
      axios.get(url).then((response_project) => {
        try {
          // Decode the Base64 string to binary data
          const binaryString = atob(response_project.data);

          setProject((prevProject) => ({
            ...prevProject,
            [`phase_${currentPage}`]: {
              ...prevProject[`phase_${currentPage}`],
              [documentRequired_]: response_project.data,
            },
          }));

          // Convert the binary string to a Uint8Array
          const uint8Array = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
          }

          // Create a Blob from the Uint8Array
          blob = new Blob([uint8Array]);

          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.setAttribute("download", `${documentRequired_}.pdf`);
          link.target = "_blank";

          // Append the link to the document and trigger the click event
          document.body.appendChild(link);
          link.click();

          // Remove the link from the document
          document.body.removeChild(link);
        } catch (error) {
          console.error("Error decoding base64 string:", error);
        }

        // console.log("response data type - ", typeof(response_project.data))
        // console.log(response_project.data)
        // blob = new Blob(response_project.data);
      });
    } else {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", `${documentRequired_}.pdf`);
      link.target = "_blank";

      // Append the link to the document and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    }
  }
  const DownloadPDF = ({ base64String, fileName, btnName }) => {
    const handleDownload = (event) => {
      event.preventDefault(); // Prevent the default form submission behavior

      // Decode Base64 to binary
      const byteCharacters = atob(base64String);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      // Create a Blob from the byte arrays
      const blob = new Blob(byteArrays, { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      // Open the Blob URL in a new tab
      const newTab = window.open();
      // navigate()
      if (newTab) {
        newTab.location.href = url;
        // Optional: Revoke the URL after a short delay to ensure it is not prematurely cleaned up
        setTimeout(() => URL.revokeObjectURL(url), 100);

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", `${fileName}.pdf`);
        link.target = "_blank";

        // Append the link to the document and trigger the click event
        document.body.appendChild(link);
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
      } else {
        // Handle the case where the new tab could not be opened
        console.error("Failed to open new tab");
      }
    };

    return (
      <Button variant="contained" onClick={handleDownload}>
        {btnName}
      </Button>
    );
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <div
        className="table-data"
        style={{
          width: "1000px",
          height: "100%",
          marginTop: "10px",
          padding: "10px 30px",
        }}
      >
        <MultiStepProgressBar
          page={currentPage}
          key={currentPage}
          onPageNumberClick={setCurrentPage}
          project_in_phase={project.phase_1.project_in_phase}
        />
        <Typography
          variant="h5"
          style={{ marginTop: "50px", fontWeight: 700, marginBottom: "20px" }}
        >
          Consumer Name:{" "}
          {isLoading ? "Loading..." : project.phase_1.consumer_name}
        </Typography>
        {/* <Table>
        <TableBody>
          <TableRow>
            {Array.from({ length: 10 }, (_, index) => (
              <TableCell key={index}>
                <Button 
                  variant={currentPage - 1 === index ? 'contained' : 'outlined'}
                  disabled={index > project.phase_1.project_in_phase - 1 ? true : false}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table> */}
        <Stack
          direction="row"
          justifyContent="space-between"
          gap={2}
          alignItems={"center"}
        >
          <span style={{ fontSize: "30px" }}>Phase {currentPage}</span>
          {currentPage &&
            (!editable[currentPage - 1] ? (
              <Button
                variant="contained"
                onClick={() => handleEditable(currentPage)}
              >
                Edit
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => handleSave(currentPage)}
              >
                Save
              </Button>
            ))}
        </Stack>
        <Divider sx={{ m: "20px 0px" }} />
        {isLoading ? (
          <Stack direction="row" justifyContent="center">
            <Loading />
          </Stack>
        ) : (
          currentPage == 1 &&
          !isLoading && (
            <form>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <InputLabel>Meter Number</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "meter_number",
                              event.target.value
                            )
                          }
                          value={project.phase_1.meter_number}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.meter_number
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <InputLabel>Current Sanctioned Load</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "current_sanctioned_load",
                              event.target.value
                            )
                          }
                          value={project.phase_1.current_sanctioned_load}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.current_sanctioned_load
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Current Phase</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "current_phase",
                              event.target.value
                            )
                          }
                          value={project.phase_1.current_phase}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.current_phase
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Installation Phase</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "installation_phase",
                              event.target.value
                            )
                          }
                          value={project.phase_1.installation_phase}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.installation_phase
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <InputLabel>Average Consumption of Unit</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "average_consumption_of_unit",
                              event.target.value
                            )
                          }
                          value={project.phase_1.average_consumption_of_unit}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.average_consumption_of_unit
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <InputLabel>Consumer Number</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "consumer_number",
                              event.target.value
                            )
                          }
                          value={project.phase_1.consumer_number}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.consumer_number
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Project Type</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "project_type",
                              event.target.value
                            )
                          }
                          value={project.phase_1.project_type}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.project_type
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Project Address</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "project_address",
                              event.target.value
                            )
                          }
                          value={project.phase_1.project_address}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.project_address
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Latitude</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange("latitude", event.target.value)
                          }
                          value={project.phase_1.latitude}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.latitude
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Longitude</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange("longitude", event.target.value)
                          }
                          value={project.phase_1.longitude}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.longitude
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Total Kilowatts</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "total_kilowatts",
                              event.target.value
                            )
                          }
                          value={project.phase_1.total_kilowatts}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.total_kilowatts
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Solar Panel Type</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "solar_panel_type",
                              event.target.value
                            )
                          }
                          value={project.phase_1.solar_panel_type}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.solar_panel_type
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Solar Inverter Make</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "solar_inverter_make",
                              event.target.value
                            )
                          }
                          value={project.phase_1.solar_inverter_make}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.solar_inverter_make
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Project Cost</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "project_cost",
                              event.target.value
                            )
                          }
                          value={project.phase_1.project_cost}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.project_cost
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Deposit Amount</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "deposit_amount",
                              event.target.value
                            )
                          }
                          value={project.phase_1.deposit_amount}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.deposit_amount
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Remaining Balance</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "remaining_balance",
                              event.target.value
                            )
                          }
                          value={project.phase_1.remaining_balance}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.remaining_balance
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Deposited Money in Words</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "deposited_money_in_words",
                              event.target.value
                            )
                          }
                          value={project.phase_1.deposited_money_in_words}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.deposited_money_in_words
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Payment Type</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "payment_type",
                              event.target.value
                            )
                          }
                          value={project.phase_1.payment_type}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.payment_type
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Transaction Number</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "transaction_number",
                              event.target.value
                            )
                          }
                          value={project.phase_1.transaction_number}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.transaction_number
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Bank Details with Branch</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "bank_details_with_branch",
                              event.target.value
                            )
                          }
                          value={project.phase_1.bank_details_with_branch}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.bank_details_with_branch
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Registration Number</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "national_portal_registration_number",
                              event.target.value
                            )
                          }
                          value={
                            project.phase_1.national_portal_registration_number
                          }
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.national_portal_registration_number
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>From Quotation</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "from_quotation",
                              event.target.value
                            )
                          }
                          value={project.phase_1.from_quotation}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.from_quotation
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Project Email</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "project_email",
                              event.target.value
                            )
                          }
                          value={project.phase_1.project_email}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.project_email
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <InputLabel>Project in Phase</InputLabel>
                    </TableCell>
                    <TableCell>
                      {editable[currentPage - 1] ? (
                        <TextField
                          onChange={(event) =>
                            handleInputChange(
                              "project_in_phase",
                              event.target.value
                            )
                          }
                          value={project.phase_1.project_in_phase}
                          disabled={!editable[currentPage - 1]}
                        />
                      ) : (
                        project.phase_1.project_in_phase
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Select
                        label="Document Required"
                        value={documentRequired}
                        onChange={(e) => {
                          setDocumentRequired(e.target.value);
                        }}
                      >
                        {options.concat(newOptions).map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDownload(documentRequired, "")}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="right"
                      colSpan={2}
                      style={{ border: "none" }}
                    >
                      {currentPage < project.phase_1.project_in_phase ? (
                        <button
                          className="btn-next"
                          type="button"
                          onClick={handleNextPage}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          className="btn-promote"
                          type="button"
                          onClick={promoteToNextPhase}
                        >
                          Promote
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </form>
          )
        )}
        {project.phase_2 && currentPage === 2 && !isLoading && (
          <form>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <InputLabel>Consumer Number</InputLabel>
                  </TableCell>
                  <TableCell>
                    {editable[currentPage - 1] ? (
                      <TextField
                        onChange={(event) =>
                          handleInputChange(
                            "consumer_number",
                            event.target.value
                          )
                        }
                        value={project.phase_2.consumer_number}
                        disabled={!editable[currentPage - 1]}
                      />
                    ) : (
                      project.phase_2.consumer_number
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>Discom Name</InputLabel>
                  </TableCell>
                  <TableCell>
                    <Select
                      label="Discom Name"
                      value={project.phase_2.discom || ""}
                      onChange={(e) => {
                        handleInputChange("discom", e.target.value);
                      }}
                      disabled={!editable[currentPage - 1]}
                    >
                      {phase_2_discom_options.map((option) => (
                        <MenuItem key={option.key_} value={option.key_}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>Discom Approval</InputLabel>
                  </TableCell>
                  <TableCell>
                    <CheckBox
                      checked={project.phase_2.discom_approval}
                      onClick={() =>
                        handleInputChange(
                          "discom_approval",
                          !project.phase_2.discom_approval
                        )
                      }
                      disabled={!editable[currentPage - 1]}
                    />
                    {project.phase_2.discom_approval}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <InputLabel>Notes</InputLabel>
                  </TableCell>
                  <TableCell>
                    <TextField
                      style={{ maxHeight: 150, width: 650, overflow: "auto" }}
                      multiline
                      value={project.phase_2.notes}
                      disabled
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <TextField
                      style={{ maxHeight: 150, width: 650, overflow: "auto" }}
                      multiline
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      disabled={!editable[currentPage - 1]}
                    />
                    <Button
                      onClick={() => handleInputChange("notes", newNote)}
                      disabled={!editable[currentPage - 1]}
                    >
                      Add Note
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ border: "none" }}>
                    <button
                      className="btn-prev"
                      type="button"
                      onClick={handlePreviousPage}
                    >
                      Previous
                    </button>
                  </TableCell>
                  <TableCell align="right" style={{ border: "none" }}>
                    {currentPage < project.phase_1.project_in_phase ? (
                      <button
                        className="btn-next"
                        type="button"
                        onClick={handleNextPage}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="btn-promote"
                        type="button"
                        onClick={promoteToNextPhase}
                      >
                        Promote
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        )}
        {project.phase_3 && currentPage === 3 && !isLoading && (
          <form>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <InputLabel>Consumer Number</InputLabel>
                  </TableCell>
                  <TableCell>
                    {editable[currentPage - 1] ? (
                      <TextField
                        onChange={(event) =>
                          handleInputChange(
                            "consumer_number",
                            event.target.value
                          )
                        }
                        value={project.phase_3.consumer_number}
                        disabled={!editable[currentPage - 1]}
                      />
                    ) : (
                      project.phase_3.consumer_number
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>Client CAD Approval</InputLabel>
                  </TableCell>
                  <TableCell>
                    <CheckBox
                      checked={project.phase_3.client_approved_cad}
                      onClick={() =>
                        handleInputChange(
                          "client_approved_cad",
                          !project.phase_3.client_approved_cad
                        )
                      }
                      disabled={!editable[currentPage - 1]}
                    />
                    {project.phase_3.client_approved_cad}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>Notes</InputLabel>
                  </TableCell>
                  <TableCell>
                    <TextField
                      style={{ maxHeight: 150, width: 650, overflow: "auto" }}
                      multiline
                      value={project.phase_3.notes}
                      disabled
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <TextField
                      style={{ maxHeight: 150, width: 650, overflow: "auto" }}
                      multiline
                      value={newNote}
                      disabled={!editable[currentPage - 1]}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button
                      onClick={() => handleInputChange("notes", newNote)}
                      disabled={!editable[currentPage - 1]}
                    >
                      Add Note
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ border: "none" }}>
                    <button
                      className="btn-prev"
                      type="button"
                      onClick={handlePreviousPage}
                    >
                      Previous
                    </button>
                  </TableCell>
                  <TableCell align="right" style={{ border: "none" }}>
                    {currentPage < project.phase_1.project_in_phase ? (
                      <button
                        className="btn-next"
                        type="button"
                        onClick={handleNextPage}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="btn-promote"
                        type="button"
                        onClick={promoteToNextPhase}
                      >
                        Promote
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        )}
        {project.phase_4 && currentPage === 4 && !isLoading && (
          <form>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <InputLabel>Consumer Number</InputLabel>
                  </TableCell>
                  <TableCell>
                    {editable[currentPage - 1] ? (
                      <TextField
                        onChange={(event) =>
                          handleInputChange(
                            "consumer_number",
                            event.target.value
                          )
                        }
                        value={project.phase_4.consumer_number}
                        disabled={!editable[currentPage - 1]}
                      />
                    ) : (
                      project.phase_4.consumer_number
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>Structure Ready</InputLabel>
                  </TableCell>
                  <TableCell>
                    <CheckBox
                      checked={project.phase_4.structure_ready}
                      onClick={() =>
                        handleInputChange(
                          "structure_ready",
                          !project.phase_4.structure_ready
                        )
                      }
                      disabled={!editable[currentPage - 1]}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>Notes</InputLabel>
                  </TableCell>
                  <TableCell>
                    <TextField
                      style={{ maxHeight: 150, width: 650, overflow: "auto" }}
                      multiline
                      value={project.phase_4.notes}
                      disabled
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <TextField
                      style={{ maxHeight: 150, width: 650, overflow: "auto" }}
                      multiline
                      value={newNote}
                      disabled={!editable[currentPage - 1]}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button
                      onClick={() => handleInputChange("notes", newNote)}
                      disabled={!editable[currentPage - 1]}
                    >
                      Add Note
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ border: "none" }}>
                    <button
                      className="btn-prev"
                      type="button"
                      onClick={handlePreviousPage}
                    >
                      Previous
                    </button>
                  </TableCell>
                  <TableCell align="right" style={{ border: "none" }}>
                    {currentPage < project.phase_1.project_in_phase ? (
                      <button
                        className="btn-next"
                        type="button"
                        onClick={handleNextPage}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="btn-promote"
                        type="button"
                        onClick={promoteToNextPhase}
                      >
                        Promote
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        )}
        {project.phase_5 && currentPage === 5 && !isLoading && (
          <form>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <InputLabel>Consumer Number</InputLabel>
                  </TableCell>
                  <TableCell>{project.phase_5.consumer_number}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>Ready to Transport</InputLabel>
                  </TableCell>
                  <TableCell>
                    <CheckBox
                      checked={project.phase_5.ready_to_transport}
                      onClick={() =>
                        handleInputChange(
                          "ready_to_transport",
                          !project.phase_5.ready_to_transport
                        )
                      }
                      disabled={!editable[currentPage - 1]}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>Notes</InputLabel>
                  </TableCell>
                  <TableCell>
                    <TextField
                      style={{ maxHeight: 150, width: 650, overflow: "auto" }}
                      multiline
                      value={project.phase_5.notes}
                      disabled={!editable[currentPage - 1]}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <TextField
                      style={{ maxHeight: 150, width: 650, overflow: "auto" }}
                      multiline
                      value={newNote}
                      disabled={!editable[currentPage - 1]}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button
                      onClick={() => handleInputChange("notes", newNote)}
                      disabled={!editable[currentPage - 1]}
                    >
                      Add Note
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ border: "none" }}>
                    <button
                      className="btn-prev"
                      type="button"
                      onClick={handlePreviousPage}
                    >
                      Previous
                    </button>
                  </TableCell>
                  <TableCell align="right" style={{ border: "none" }}>
                    {currentPage < project.phase_1.project_in_phase ? (
                      <button
                        className="btn-next"
                        type="button"
                        onClick={handleNextPage}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="btn-promote"
                        type="button"
                        onClick={promoteToNextPhase}
                      >
                        Promote
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        )}
        {project.phase_6 && currentPage === 6 && !isLoading && (
          <form>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <h1>SKIP FOR INVENTORY</h1>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ border: "none" }}>
                    <button
                      className="btn-prev"
                      type="button"
                      onClick={handlePreviousPage}
                    >
                      Previous
                    </button>
                  </TableCell>
                  <TableCell align="right" style={{ border: "none" }}>
                    {currentPage < project.phase_1.project_in_phase ? (
                      <button
                        className="btn-next"
                        type="button"
                        onClick={handleNextPage}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="btn-promote"
                        type="button"
                        onClick={promoteToNextPhase}
                      >
                        Promote
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        )}
        {project.phase_7 &&
          currentPage === 7 &&
          !isLoading &&
          project.phase_1.project_type != "Residential" && (
            <form>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <InputLabel>Consumer Number</InputLabel>
                    </TableCell>
                    <TableCell>{project.phase_7.consumer_number}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <InputLabel>
                        GEDA Approval for electric diagram
                      </InputLabel>
                    </TableCell>
                    <TableCell>
                      <CheckBox
                        checked={project.phase_7.geda_approval}
                        onClick={() =>
                          handleInputChange(
                            "geda_approval",
                            !project.phase_7.geda_approval
                          )
                        }
                        disabled={!editable[currentPage - 1]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <InputLabel>Electrical Diagram</InputLabel>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        component="label"
                        disabled={!editable[currentPage - 1]}
                      >
                        Upload Electrical Diagram
                        <input
                          type="file"
                          name="electrical_diagram"
                          onChange={(e) =>
                            handleInputChange(
                              "electrical_diagram",
                              e.target.files[0]
                            )
                          }
                          hidden
                        />
                      </Button>
                      <Button
                        onClick={() => handleDownload("electrical_diagram", "")}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <InputLabel>Notes</InputLabel>
                    </TableCell>
                    <TableCell>
                      <TextField
                        style={{ maxHeight: 150, width: 650, overflow: "auto" }}
                        multiline
                        value={project.phase_7.notes}
                        disabled
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell />
                    <TableCell>
                      <TextField
                        style={{ maxHeight: 150, width: 650, overflow: "auto" }}
                        multiline
                        value={newNote}
                        disabled={!editable[currentPage - 1]}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <Button
                        onClick={() => handleInputChange("notes", newNote)}
                        disabled={!editable[currentPage - 1]}
                      >
                        Add Note
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left" style={{ border: "none" }}>
                      <button
                        className="btn-prev"
                        type="button"
                        onClick={handlePreviousPage}
                      >
                        Previous
                      </button>
                    </TableCell>
                    <TableCell align="right" style={{ border: "none" }}>
                      {currentPage < project.phase_1.project_in_phase ? (
                        <button
                          className="btn-next"
                          type="button"
                          onClick={handleNextPage}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          className="btn-promote"
                          type="button"
                          onClick={promoteToNextPhase}
                        >
                          Promote
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </form>
          )}
        {project.phase_7 &&
          currentPage === 7 &&
          !isLoading &&
          project.phase_1.project_type == "Residential" && (
            <>
              <span style={{ fontSize: "30px" }}>
                Phase 7 not applicable for Residential Projects. Move to phase
                8.
              </span>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align="left" style={{ border: "none" }}>
                      <button
                        className="btn-prev"
                        type="button"
                        onClick={handlePreviousPage}
                      >
                        Previous
                      </button>
                    </TableCell>
                    <TableCell align="right" style={{ border: "none" }}>
                      {currentPage < project.phase_1.project_in_phase ? (
                        <button
                          className="btn-next"
                          type="button"
                          onClick={handleNextPage}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          className="btn-promote"
                          type="button"
                          onClick={promoteToNextPhase}
                        >
                          Promote
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        {project.phase_8 && currentPage === 8 && !isLoading && (
          <form>
            <Table>
              <TableBody>
                <TableRow>
                  <InputLabel>Upload Industrial Agreement</InputLabel>
                  <TableCell>
                    <input
                      disabled={!editable[currentPage - 1]}
                      type="file"
                      name="project_agreement"
                      onChange={(e) =>
                        handleInputChange(
                          "project_agreement",
                          e.target.files[0]
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <DownloadPDF
                      base64String={project?.phase_8?.project_agreement}
                      btnName={"Download project_agreement"}
                      fileName={"project_agreement.pdf"}
                      key={"Four Page Self Certificate"}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <InputLabel>Upload Vendor Agreement</InputLabel>
                  <TableCell>
                    <input
                      type="file"
                      disabled={!editable[currentPage - 1]}
                      name="vendor_agreement"
                      onChange={(e) =>
                        handleInputChange("vendor_agreement", e.target.files[0])
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <DownloadPDF
                      base64String={project?.phase_8?.vendor_agreement}
                      btnName={"Download Vendor Agreement"}
                      fileName={"vendor_agreement.pdf"}
                      key={"Four Page Self Certificate"}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <InputLabel>Upload One Page Self Certificate</InputLabel>
                  <TableCell>
                    <input
                      type="file"
                      disabled={!editable[currentPage - 1]}
                      name="on"
                      onChange={(e) =>
                        handleInputChange(
                          "one_page_certificate",
                          e.target.files[0]
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <DownloadPDF
                      base64String={project?.phase_8?.one_page_certificate}
                      btnName={"Download One Page Self Certificate"}
                      fileName={"one_page_certificate.pdf"}
                      key={"Four Page Self Certificate"}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <InputLabel>Upload Four Page Self Certificate</InputLabel>
                  <TableCell>
                    <input
                      type="file"
                      disabled={!editable[currentPage - 1]}
                      name="four_page_certificate"
                      onChange={(e) =>
                        handleInputChange(
                          "four_page_certificate",
                          e.target.files[0]
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <DownloadPDF
                      base64String={project?.phase_8?.four_page_certificate}
                      btnName={"Download Four Page Self Certificate"}
                      fileName={"four_page_certificate.pdf"}
                      key={"Four Page Self Certificate"}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ border: "none" }}>
                    <button
                      className="btn-prev"
                      type="button"
                      onClick={handlePreviousPage}
                    >
                      Previous
                    </button>
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ border: "none" }}
                  ></TableCell>
                  <TableCell align="right" style={{ border: "none" }}>
                    {currentPage < project.phase_1.project_in_phase ? (
                      <button
                        className="btn-next"
                        type="button"
                        onClick={handleNextPage}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="btn-promote"
                        type="button"
                        onClick={promoteToNextPhase}
                      >
                        Promote
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        )}
        {project.phase_9 &&
          currentPage === 9 &&
          !isLoading &&
          project.phase_1.project_type == "Residential" && (
            <form>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <InputLabel>Consumer Number</InputLabel>
                    </TableCell>
                    <TableCell>{project.phase_9.consumer_number}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <InputLabel>Meter Report</InputLabel>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        component="label"
                        disabled={!editable[currentPage - 1]}
                      >
                        Upload Meter Report
                        <input
                          type="file"
                          name="meter_report"
                          onChange={(e) =>
                            handleInputChange("meter_report", e.target.files[0])
                          }
                          hidden
                        />
                      </Button>
                      {/* <Button
                        onClick={() => handleDownload("meter_report", "")}
                      >
                        Download
                      </Button> */}
                    </TableCell>
                    <TableCell>
                      <DownloadPDF
                        base64String={project?.phase_9?.meter_report}
                        btnName={"Download Meter Report"}
                        fileName={"meter_report"}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <InputLabel>Joint Inspection</InputLabel>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        component="label"
                        disabled={!editable[currentPage - 1]}
                      >
                        Upload Joint Inspection
                        <input
                          type="file"
                          name="joint_inspection"
                          onChange={(e) =>
                            handleInputChange(
                              "joint_inspection",
                              e.target.files[0]
                            )
                          }
                          hidden
                        />
                      </Button>
                      {/* <Button
                        onClick={() => handleDownload("joint_inspection", "")}    
                      >
                        Download
                      </Button> */}
                    </TableCell>
                    <TableCell>
                      <DownloadPDF
                        base64String={project?.phase_9?.joint_inspection}
                        btnName={"Download joint inspection "}
                        fileName={"joint_inspection"}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left" style={{ border: "none" }}>
                      <button
                        className="btn-prev"
                        type="button"
                        onClick={handlePreviousPage}
                      >
                        Previous
                      </button>
                    </TableCell>
                    <TableCell align="right" style={{ border: "none" }}>
                      {currentPage < project.phase_1.project_in_phase ? (
                        <button
                          className="btn-next"
                          type="button"
                          onClick={handleNextPage}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          className="btn-promote"
                          type="button"
                          onClick={promoteToNextPhase}
                        >
                          Promote
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </form>
          )}
        {project.phase_9 &&
          currentPage === 9 &&
          !isLoading &&
          project.phase_1.project_type != "Residential" && (
            <>
              <span style={{ fontSize: "30px" }}>
                Phase 9 not applicable for Residential Projects. Move to phase
                10.
              </span>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align="left" style={{ border: "none" }}>
                      <button
                        className="btn-prev"
                        type="button"
                        onClick={handlePreviousPage}
                      >
                        Previous
                      </button>
                    </TableCell>
                    <TableCell align="right" style={{ border: "none" }}>
                      {currentPage < project.phase_1.project_in_phase ? (
                        <button
                          className="btn-next"
                          type="button"
                          onClick={handleNextPage}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          className="btn-promote"
                          type="button"
                          onClick={promoteToNextPhase}
                        >
                          Promote
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        {project.phase_10 && currentPage === 10 && !isLoading && (
          <form>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <InputLabel>Consumer Number</InputLabel>
                  </TableCell>
                  <TableCell>{project.phase_10.consumer_number}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>Invoice from accounts</InputLabel>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      component="label"
                      disabled={!editable[currentPage - 1]}
                    >
                      Upload Invoice
                      <input
                        type="file"
                        name="invoice_from_accounts"
                        onChange={(e) =>
                          handleInputChange(
                            "invoice_from_accounts",
                            e.target.files[0]
                          )
                        }
                        hidden
                      />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DownloadPDF
                      base64String={project.phase_10.invoice_from_accounts}
                      btnName={"Download invoice_from_accounts"}
                      fileName={"invoice_from_accounts"}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>DCR</InputLabel>
                  </TableCell>
                  {/* <TableCell>
                    <Button onClick={() => handleDownload("dcr", "")}>
                      Download
                    </Button>
                  </TableCell> */}
                  <TableCell>
                    <Button
                      variant="contained"
                      component="label"
                      disabled={!editable[currentPage - 1]}
                    >
                      Upload Dcr
                      <input
                        type="file"
                        name="dcr"
                        onChange={(e) =>
                          handleInputChange("dcr", e.target.files[0])
                        }
                        hidden
                      />
                    </Button>
                    {/* <Button onClick={() => handleDownload("dcr", "")}>
                      Download
                    </Button> */}
                  </TableCell>
                  <TableCell>
                    <DownloadPDF
                      base64String={project.phase_10.dcr}
                      btnName={"Download dcr"}
                      fileName={"dcr"}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ border: "none" }}>
                    <button
                      className="btn-prev"
                      type="button"
                      onClick={handlePreviousPage}
                    >
                      Previous
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        )}
      </div>
    </Paper>
  );
};

export default ViewProject;
