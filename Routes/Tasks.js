// const express=require('express')
// const moment = require('moment'); // Install moment if not already installed
// const router=express.Router()
// const getQuery=require('../queries/get.json')
// const postQuery=require('../queries/post.json')
// const updateQuery=require('../queries/update.json')
// const connection=require('../db')
// const multer = require('multer');
// const xlsx = require('xlsx');
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.post('/taskUpload', upload.single('file'), async (req, res) => {
//     const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const tasks = xlsx.utils.sheet_to_json(worksheet);

//     try {
//         await connection.query(postQuery.CreateTaskTable);
//         for (let i = 0; i < tasks.length; i++) {
//             let { 
//                 Project_ID, Project_Name, Task_Name, EmployeeID, Task_Owner, AssignedTo, Task_Description, Start_Date, End_Date, Status, Complexity, Reason, efforts 
//             } = tasks[i];

//             // Generate a new Task_ID for each task
//             const [rows] = await connection.query(getQuery.idquery,[EmployeeID]); // Assuming you have a query to get the last Task_ID
//             let newTaskId = "TASK2025001";
//             if (rows.length > 0) {
//                 const latestTaskId = rows[0].Task_ID;
//                 const currentIdNumber = parseInt(latestTaskId.slice(-6));
//                 const newIdNumber = currentIdNumber + 1;
//                 newTaskId = `TASK20${String(newIdNumber).padStart(5, '0')}`;
//             }

//             // Convert dates to 'YYYY-MM-DD' format
//             Start_Date = new Date(Start_Date).toISOString().split('T')[0];
//             End_Date = new Date(End_Date).toISOString().split('T')[0];

//             await connection.query(postQuery.AddTask, [
//                 newTaskId, Project_ID, Project_Name, Task_Name, EmployeeID, Task_Owner, AssignedTo, Task_Description, Start_Date, End_Date, Status, Complexity, Reason, efforts
//             ]);
//         }
//         res.send({ message: "Tasks added successfully" });
//     } catch (error) {
//         console.error('Error inserting task data:', error);
//         res.status(500).send({ error: "An error occurred while inserting task data." });
//     }
// });


// router.post('/taskAdd', async (req, res) => {
//     try {
//         await connection.query(postQuery.CreateTaskTable);
//         const { 
//             Project_ID, Project_Name, Task_Name, EmployeeID, Task_Owner, AssignedTo,
//             Task_Description, Start_Date, End_Date, Status, Complexity, Reason, efforts 
//         } = req.body;

//         // Fetch the last Task_ID for the specific EmployeeID
//         const [rows] = await connection.query(getQuery.idquery, [EmployeeID]);

//         let newTaskId = `TASK${EmployeeID.slice(-6)}001`; // Default Task ID if no previous task exists for the employee
//         if (rows.length > 0) {
//             const latestTaskId = rows[0].Task_ID;
//             const currentIdNumber = parseInt(latestTaskId.slice(-3)); // Extract the last 3 digits of the Task_ID
//             const newIdNumber = currentIdNumber + 1;
//             newTaskId = `TASK${EmployeeID.slice(-6)}${String(newIdNumber).padStart(3, '0')}`; // Generate new Task_ID for that EmployeeID
//         }

//         // Convert Start_Date and End_Date to 'YYYY-MM-DD' format if necessary
//         const formattedStartDate = Start_Date ? new Date(Start_Date).toISOString().split('T')[0] : null;
//         const formattedEndDate = End_Date ? new Date(End_Date).toISOString().split('T')[0] : null;

//         // Insert new task into the database
//         await connection.query(postQuery.AddTask, [
//             newTaskId, Project_ID, Project_Name, Task_Name, EmployeeID, Task_Owner, AssignedTo, 
//             Task_Description, formattedStartDate, formattedEndDate, Status, Complexity, Reason, efforts
//         ]);

//         res.send({ message: "Task added successfully" });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ error: "An error occurred while adding the task." });
//     }
// });
// router.put('/update',async (req,res)=>{
//     try {
//         const {tid,eid,Status,Reason}=req.body;
//         const [result]=await connection.query(updateQueries.updateStatus,[Status,Reason,tid,eid]);
//         if(result.affectedRows===0)
//         {
//             res.status(404).send({message:"Invalid task Id"});
//         }
//         console.log(result.affectedRows)
//         res.status(200).send({message:"updated successfully"});
//     } catch (err) {
//         console.error('Error updating task status:', err.stack);
//         res.status(500).send({ error: "Internal server error." });
//     }
// })
// router.put('/taskUpdate/:Task_ID/:EmployeeID', async (req, res) => {
//     try {
//       const { Task_ID, EmployeeID } = req.params;
//       const {
//         Project_ID, Project_Name, Task_Name, Task_Owner, AssignedTo,
//         Task_Description, Start_Date, End_Date, Status, Complexity, Reason, efforts
//       } = req.body;
//       console.log(`Received update request for Task_ID: ${req.params.Task_ID} and EmployeeID: ${req.params.EmployeeID}`);
//       let updateFields = [];
//       let updateValues = [];
  
//       if (Project_ID) updateFields.push("Project_ID = ?"), updateValues.push(Project_ID);
//       if (Project_Name) updateFields.push("Project_Name = ?"), updateValues.push(Project_Name);
//       if (Task_Name) updateFields.push("Task_Name = ?"), updateValues.push(Task_Name);
//       if (Task_Owner) updateFields.push("Task_Owner = ?"), updateValues.push(Task_Owner);
//       if (AssignedTo) updateFields.push("AssignedTo = ?"), updateValues.push(AssignedTo);
//       if (Task_Description) updateFields.push("Task_Description = ?"), updateValues.push(Task_Description);
  
//       if (Start_Date) {
//         const formattedStartDate = moment(Start_Date).format('YYYY-MM-DD HH:mm:ss');
//         updateFields.push("Start_Date = ?"), updateValues.push(formattedStartDate);
//       }
//       if (End_Date) {
//         const formattedEndDate = moment(End_Date).format('YYYY-MM-DD HH:mm:ss');
//         updateFields.push("End_Date = ?"), updateValues.push(formattedEndDate);
//       }
  
//       if (Status) updateFields.push("Status = ?"), updateValues.push(Status);
//       if (Complexity) updateFields.push("Complexity = ?"), updateValues.push(Complexity);
//       if (Reason) updateFields.push("Reason = ?"), updateValues.push(Reason);
//       if (efforts) updateFields.push("efforts = ?"), updateValues.push(efforts);
  
//       if (updateFields.length === 0) {
//         return res.status(400).send({ error: "No fields provided to update." });
//       }
  
//       // Add Task_ID and EmployeeID to the values array for the WHERE clause
//       updateValues.push(Task_ID);
//       updateValues.push(EmployeeID);
  
//       // Update query with both Task_ID and EmployeeID in the WHERE clause
//       const updateQuery = `UPDATE Tasks SET ${updateFields.join(', ')} WHERE Task_ID = ? AND EmployeeID = ?`;
  
//       connection.query(updateQuery, updateValues, (err, result) => {
//         if (err) {
//           console.error("Error executing query", err);
//           return res.status(500).send({ error: "An error occurred while updating the task." });
//         }
//     res.status(200).send({ message: "Task updated successfully" });
//       });
  
//     } catch (err) {
//       console.error("Error handling request", err);
//       res.status(500).send({ error: "An error occurred while updating the task." });
//     }
//   });
  
// router.get('/gettasks',async (req,res)=>{
//     try {
//         const [results] = await connection.query(getQuery.getTasks);
//         res.status(200).send(results);
//     } catch (err) {
//         console.error('Error retrieving tasks:', err.stack);
//         res.status(500).send({ error: "Internal server error." });
//     }
// })

// router.get('/gettask/:id',async (req,res)=>{
//     try {
//         const tid=req.params.id;
//         const [results] = await connection.query(getQuery.getTaskById,tid);
//         res.status(200).send(results);
//     } catch (err) {
//         console.error('Error retrieving tasks:', err.stack);
//         res.status(500).send({ error: "Internal server error." });
//     }
// })
// router.get('/getemployee/:id',async (req,res)=>{
//     try {
//         const EmployeeID=req.params.id;
//         const [results] = await connection.query(getQuery.getEmployeeById,EmployeeID);
//         res.status(200).send(results);
//     } catch (err) {
//         console.error('Error retrieving tasks:', err.stack);
//         res.status(500).send({ error: "Internal server error." });
//     }
// })
// router.put('/update/:id',async (req,res)=>{
//     try {
//         const tid=req.params.id;
//         const {Status,Reason}=req.body;
//         const [result]=await connection.query(updateQuery.updateStatus,[Status,tid,Reason]);
//         if(result.affectedRows===0)
//         {
//             res.status(404).send({message:"Invalid task Id"});
//         }
//         console.log(result.affectedRows)
//         res.status(200).send({message:"updated successfully"});
//     } catch (err) {
//         console.error('Error updating task status:', err.stack);
//         res.status(500).send({ error: "Internal server error." });
//     }
// })

// // Route to get the total count of tasks
// router.get('/taskcount', async (req, res) => {
//     try {
//         const [rows] = await connection.query(getQuery.gettaskcount);
//         res.json(rows[0]);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Route to get the number of unique employees
// router.get('/empcount', async (req, res) => {
//     try {
//         const [rows] = await connection.query(getQuery.getempcount);
//         res.json(rows[0]);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Route to get the count of completed tasks
// router.get('/completedcount', async (req, res) => {
//     try {
//         const [rows] = await connection.query(getQuery.getcompletedcount);
//         res.json(rows[0]);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Route to get the count of incomplete tasks
// router.get('/incompletedcount', async (req, res) => {
//     try {
//         const [rows] = await connection.query(getQuery.getincompletedcount);
//         res.json(rows[0]);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
// router.get('/getreason', (req, res) => {
//     const { EmployeeID, Task_ID } = req.query;
//     if (!EmployeeID || !Task_ID) {
//       return res.status(400).json({ error: "EmployeeID and Task_ID are required" });
//     }
//     connection.query(getQuery.getreason, [EmployeeID, Task_ID], (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       if (result.length > 0) {
//         return res.json({ reason: result[0].Reason });
//       } else {
//         return res.status(404).json({ message: "No reason found for the given EmployeeID and Task_ID" });
//       }
//     });
//   });
// module.exports=router;




// import { MdOutlineFileDownload } from "react-icons/md";
// import { FaRegEye, FaCloudUploadAlt } from "react-icons/fa";
// import axios from "axios";
// import './Payslips.css';
// import { useState,useEffect,useRef } from "react";

// const Payslips = () => {
//   const [documentType, setDocumentType] = useState("payslips");
//   const [pdfs, setDocuments] = useState([]);
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [uploadFiles, setUploadFiles] = useState({
//     offerLetter: null,
//     compensationLetter: null,
//     form16: null,
//   });
//   const pdfRef = useRef();
//   const employeeId = localStorage.getItem('employee');
//   const employee = JSON.parse(employeeId);
//   const employeeid = employee?.EmployeeID;

//   console.log(employeeid); // Use employeeid

//   // Fetch payslips from the backend
//   const fetchPayslips = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_URL}/user/getpayslip/${employeeid}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       console.log('Fetched Payslip Data:', response.data);
//       setDocuments(response.data || []);
//     } catch (error) {
//       console.error("Error fetching payslip data:", error.response ? error.response.data : error.message);
//       setDocuments([]);
//     }
//   };

//   // Fetch documents like offer letters, compensation letters, or form16
//   const fetchDocuments = async (type) => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_URL}/user/getletters/${employeeid}`);
//       console.log(`Fetched ${type} Data:`, response.data);
//       setDocuments(response.data || []);
//     } catch (error) {
//       console.error(`Error fetching ${type} data:`, error.response ? error.response.data : error.message);
//       setDocuments([]);
//     }
//   };

//   // Fetch based on the selected document type
//   useEffect(() => {
//     if (employeeid) {
//       if (documentType === "payslips") {
//         fetchPayslips();
//       } else {
//         fetchDocuments(documentType); // Offer Letters, Compensation Letters, Form 16
//       }
//     } else {
//       console.error('EmployeeID is null or undefined. Cannot fetch payslips.');
//     }
//   }, [documentType, employeeid]);

//   // Handle file changes for all three documents
//   const handleFileChange = (e, type) => {
//     setUploadFiles({
//       ...uploadFiles,
//       [type]: e.target.files[0],
//     });
//   };

//   const handleDownload = (pdfUrl) => {
//     fetch(pdfUrl)
//       .then((response) => response.blob())
//       .then((blob) => {
//         const fileURL = window.URL.createObjectURL(blob);
//         let alink = document.createElement("a");
//         alink.href = fileURL;
//         const filename = pdfUrl.split("/").pop() || "document.pdf";
//         alink.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
//         alink.click();
//         URL.revokeObjectURL(fileURL);
//       })
//       .catch((error) => {
//         console.error("Error downloading file:", error);
//       });
//   };

//   // Handle PDF preview
//   const handlePreview = (pdfUrl) => {
//     setSelectedPdf(pdfUrl);
//   };

//   // Handle file upload for all documents at once
//   const handleUpload = async () => {
//     const { offerLetter, compensationLetter, form16 } = uploadFiles;

//     if (!offerLetter || !compensationLetter || !form16) {
//       alert("Please upload all required files.");
//       return;
//     }

//     const uploadToCloudinary = async (file) => {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);

//       const uploadResponse = await axios.post(
//         `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
//         formData
//       );
//       return uploadResponse.data.secure_url;
//     };

//     try {
//       const offerLetterUrl = await uploadToCloudinary(offerLetter);
//       const compensationLetterUrl = await uploadToCloudinary(compensationLetter);
//       const form16Url = await uploadToCloudinary(form16);

//       // Save the uploaded files' URLs to your backend
//       await axios.post(`${process.env.REACT_APP_URL}/user/addletters`, {
//         employeeid,
//         offerLetterUrl,
//         compensationLetterUrl,
//         form16Url,
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       alert("All documents uploaded successfully!");
//       fetchDocuments(documentType); // Refetch documents to display the new uploads
//     } catch (error) {
//       console.error("Error uploading files:", error);
//     }
//   };

//   return (
//     <div className="paySlipContainer">
//       <div className="payRollDetails">
//         <div className="documentLinks">
//           <button onClick={() => setDocumentType("payslips")}>Payslips</button>
//           <button onClick={() => setDocumentType("offerLetters")}>Offer Letters</button>
//           <button onClick={() => setDocumentType("compensationLetters")}>Compensation Letters</button>
//           <button onClick={() => setDocumentType("form16")}>Form-16</button>
//         </div>

//         <div className="paySlipTable">
//           <table className="dataTable">
//             <thead>
//               <tr>
//                 <th>Month</th>
//                 <th>Year</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pdfs.length > 0 ? (
//                 pdfs.map((pdf) => (
//                   <tr key={pdf.PaySlipId || pdf.OfferLetterId || pdf.Form16Id}>
//                     <td>{pdf.Month || '--'}</td>
//                     <td>{pdf.Year || '--'}</td>
//                     <td>
//                       <div className="tableActions">
//                         <MdOutlineFileDownload
//                           className="actionIcon"
//                           onClick={() => handleDownload(pdf.url)}
//                         />
//                         <FaRegEye
//                           className="actionIcon"
//                           onClick={() => handlePreview(pdf.url)}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3">
//                     {documentType === "payslips"
//                       ? "No Payslips Available."
//                       : "No Documents Available."}
//                     {documentType !== "payslips" && (
//                       <div> <br />Offer Letter
//                         <input
//                           type="file"
//                           onChange={(e) => handleFileChange(e, 'offerLetter')}
//                           accept="application/pdf"
//                         /> <br /> <br />Compensation Letter
//                         <input
//                           type="file"
//                           onChange={(e) => handleFileChange(e, 'compensationLetter')}
//                           accept="application/pdf"
//                         /> <br /> <br /> Form 16
//                         <input
//                           type="file"
//                           onChange={(e) => handleFileChange(e, 'form16')}
//                           accept="application/pdf"
//                         />
//                         <button onClick={handleUpload}>
//                           <FaCloudUploadAlt /> Upload All Documents
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="payRollPreview">
//         {selectedPdf ? (
//           <div ref={pdfRef} className="pdfViewer">
//             <iframe
//               src={selectedPdf}
//               width="100%"
//               height="750px"
//               title="PDF Viewer"
//             ></iframe>
//           </div>
//         ) : (
//           <div className="noData">
//             <p>No PDF Selected</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Payslips;
