// mongodb+srv://princebuencamino:LIS092901@lis.1ioj1.mongodb.net/?retryWrites=true&w=majority&appName=LIS

const express = require ('express')
const connectDB = require('./db.js')
const { appdata } = require("./models/data");
const cors = require('cors')
const {
    userModel,
    patientModel,
    requestModel,
    hematologyModel,
    clinicalMicroscopyModel,
    chemistryModel,
    serologyModel,
    // Use this model to look for the corresponding test
    // Note: Can't query specific values of tests, use other
    // Models to query a specific category
    allTestModel
} = appdata;

const app = express()
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(cors())
connectDB()

app.get('/', async (req, res) => {
    try {
        // Fetch data from all models
        const users = await userModel.find();
        const patients = await patientModel.find();
        const requests = await requestModel.find();
        const hematologyTests = await hematologyModel.find();
        const clinicalMicroscopyTests = await clinicalMicroscopyModel.find();
        const chemistryTests = await chemistryModel.find();
        const serologyTests = await serologyModel.find();
        const allTests = await allTestModel.find();

        // Return the combined data as an object
        res.json({
            users,
            patients,
            requests,
            hematologyTests,
            clinicalMicroscopyTests,
            chemistryTests,
            serologyTests,
            allTests
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/requests', async (req, res) => {
    try {
        let searchQuery = { $and: [] };
        let listofID = [];
        let requestData = [[]];
        let i = 0;

        // fetch all patients by default
        const patients = await patientModel.find();

        if (req.query.search !== undefined || req.query.search !== "") {
            regex = new RegExp(req.query.search, "i"); // for case insentivity

            const patients = await patientModel.find({ name: regex });
            for (const item of patients) {
                //console.log(item.patientID);
                //console.log(item.name);
                listofID.push(item.patientID);
            }

            searchQuery.$and.push({
                $or: [
                    { category: regex },
                    { test: regex },
                    { status: regex },
                    { remarks: regex },
                    { patientID: { $in: listofID } },
                ],
            });
        }

        if (req.query.lowerdatest !== undefined || req.query.upperdatest !== undefined || req.query.lowerdateen !== undefined || req.query.upperdateen !== undefined) {
            const dateRangeQuerySt = {};
            const dateRangeQueryEn = {};

            if (req.query.lowerdatest !== undefined) {
                const lowerDateSt = new Date(req.query.lowerdatest);
                dateRangeQuerySt["$gte"] = lowerDateSt;
                //console.log("LowerDatST " + lowerDateSt);
            }

            if (req.query.upperdatest !== undefined) {
                const upperDateSt = new Date(req.query.upperdatest);
                dateRangeQuerySt["$lte"] = upperDateSt;
                //console.log("UpperDateST " + upperDateSt);
            }

            if (Object.keys(dateRangeQuerySt).length > 0) {
                searchQuery.$and.push({ dateStart: dateRangeQuerySt });
            }

            if (req.query.lowerdateen !== undefined) {
                const lowerDateEn = new Date(req.query.lowerdateen);
                dateRangeQueryEn["$gte"] = lowerDateEn;
                //console.log("LowerDateEN " + lowerDateEn);
            }

            if (req.query.upperdateen !== undefined) {
                const upperDateEn = new Date(req.query.upperdateen);
                dateRangeQueryEn["$lte"] = upperDateEn;
                //console.log("UpperDateEN " + upperDateEn);
                //console.log("");
            }

            if (Object.keys(dateRangeQueryEn).length > 0) {
                searchQuery.$and.push({ dateEnd: dateRangeQueryEn });
            }
        }

        // Check if category is defined and non-empty
        if (req.query.category !== "AA" && req.query.category !== undefined) {
            // Add category query to the search query
            searchQuery.$and.push({ category: req.query.category });
        }

        // Check if test is defined and non-empty
        if (req.query.tests !== "AAA" && req.query.tests !== undefined) {
            // Add test query to the search query
            regex2 = new RegExp(req.query.tests, "i");
            searchQuery.$and.push({ test: regex2 });
        }

        // Check if status is defined and non-empty
        if (req.query.status !== "A" && req.query.status !== undefined) {
            // Add status query to the search query
            searchQuery.$and.push({ status: req.query.status });
        }

        //console.log("Search Query");
        //console.log(searchQuery);

        if (searchQuery.$and.length === 0) {
            searchQuery = {};
        }

        // Requests sorted by requestID in descending order
        const requests = await requestModel.find(searchQuery).sort({ requestID: -1 });

        //console.log(requests);
        
        // Create a map of patient IDs to patient names for quick lookups
        const patientMap = {};
        patients.forEach(patient => {
          patientMap[patient.patientID] = patient.name;
        });
    
        // Iterate over each request to format the data
        for (const request of requests) {
          let statusColor;
          if (request.status === "Completed") {
            statusColor = "c";
          } else if (request.status === "In Progress") {
            statusColor = "ip";
          } else {
            statusColor = "req";
          }

          // Format dates if available, otherwise set to an empty string
          const formatDateTime = (date) => 
            date ? new Date(date).toLocaleString('en-US', {
              month: '2-digit', day: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit', hour12: true
            }) : "";
          
          // Push formatted request data into the nested arrays
          requestData[i].push({
            requestID: request.requestID,
            patientID: request.patientID,
            name: patientMap[request.patientID], // Retrieve the name from the patient map
            tests: request.category,
            barColor: statusColor,
            requestStatus: request.status,
            remarks: request.remarks,
            paymentStatus: request.payStatus,
            dateRequested: formatDateTime(request.dateStart),
            dateCompleted: formatDateTime(request.dateEnd)
          });

          // Split into groups of 5
          if (requestData[i].length === 5) {
            i++;
            requestData[i] = [];
          }
        }
    
        // If the last subarray is empty, remove it
        if (requestData[requestData.length - 1].length === 0) {
          requestData.pop();
        }
    
        res.json(requestData);    

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


app.put("/api/requests/:requestID", async (req, res) => {
  const { requestID } = req.params;
  const { status, payStatus, remarks } = req.body;

  try {
    console.log("Received PUT request to update requestID:", requestID);
    console.log("New data:", { status, payStatus, remarks });

    // Get the current date and time
    const currentDate = new Date();

    // Prepare the update data
    const updateData = {
      status,
      payStatus,
      remarks,
    };

    // If the status is 'Completed', set dateEnd to the current date
    if (status === "Completed") {
      updateData.dateEnd = currentDate; // Add dateEnd to the update data
    }

    const updatedRequest = await requestModel.findOneAndUpdate(
      { requestID: parseInt(requestID) }, // Ensure requestID matches the schema type
      updateData,
      { new: true }
    );

    if (!updatedRequest) {
      console.log("Request not found in database.");
      return res.status(404).json({ message: "Request not found" });
    }

    console.log("Request updated successfully:", updatedRequest);
    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
  



app.listen(port, function(){
    console.log('Listening at port '+port);
  });