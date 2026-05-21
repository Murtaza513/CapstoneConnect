import React, { useEffect, useState } from 'react';
import { ErrorToaster, SuccessToaster } from '../Utils/Toast';
import Axios from '../../axios';
import MultiSelect from '../AdminFiles/MultiSelect';
import TagsInput from '../StudentFiles/TagsInput';
import { useNavigate } from 'react-router-dom';
import { Page, Text, View, Document, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import logo from '../assets/CC Logo_Logo.jpg';

// Define styles
const styles = StyleSheet.create({
    page: { padding: 30 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    logo: { width: 100 },
    title: { flex: 1, fontSize: 24, color: '#1F4E78', textAlign: 'center' },
    info: { textAlign: 'right', fontSize: 12 },
    sectionTitle: { fontSize: 16, color: '#1F4E78', marginBottom: 10 },
    table: { display: 'table', width: 'auto', marginBottom: 20 },
    tableRow: { flexDirection: 'row' },
    tableColHeader: { width: '50%', backgroundColor: '#E3E3E3', padding: 5, border: '1px solid #ccc' },
    tableCol: { width: '50%', padding: 5, border: '1px solid #ccc' },
    tableCellHeader: { fontSize: 12, fontWeight: 'bold', textAlign: 'left' },
    tableCell: { fontSize: 12, textAlign: 'left' },
    section: { marginBottom: 20 },
    text: { fontSize: 12 }
});

const MyDocument = ({ data, members }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/*Logo*/}
            <View style={styles.header}>
                <Image style={styles.logo} src={logo} />
                <Text style={styles.title}>FYP Project Evaluation</Text>
            </View>

            {/*Header Information */}
            <View style={styles.header}>
                <Text style={styles.info}>
                    Evaluation Date: {data?.Date}{'\n'}
                </Text>
            </View>
            <Text style={styles.sectionTitle}>Enternal Jury</Text>
            <Text style={styles.text}>{data?.InternalJury}</Text>
            <Text style={styles.sectionTitle}>External Jury</Text>
            <Text style={styles.text}>{data?.ExternalJury}</Text>

            {/*Table of Participants and Grades*/}
            <Text style={styles.sectionTitle}>List of Participants and Grades</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>Name</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>Grade</Text>
                    </View>
                </View>
                {Object.entries(members).map(([memberId, memberName]) => (
                    <View style={styles.tableRow} key={memberId}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{memberName}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{data.grades[memberId]}</Text>
                        </View>
                    </View>
                ))}
                
            </View>

            {/*Remarks */}
            <Text style={styles.sectionTitle}>Remarks</Text>
            <Text style={styles.text}>{data?.Remarks}</Text>
        </Page>
    </Document>
);

const EvaluationDialog = ({ status, handleClose, descData, handleDescChange, jury, selectedJury, setSelectedJury, selectedRemark, setSelectedRemark, selectedGrade, setSelectedGrade, setDescData, projectId, fetchSupervisors, members }) => {
    const navigate = useNavigate()
    const [evalErr, setEvalErr] = useState(null)
    const [btnLoading, setBtnLoading] = useState(false);
    const [memberGrades, setMemberGrades] = useState(
        Object.keys(members).reduce((acc, memberId) => ({ ...acc, [memberId]: '' }), {})
    );

    const handleGradeChange = (memberId, grade) => {
        setMemberGrades((prevGrades) => ({
            ...prevGrades,
            [memberId]: grade,
        }));
    };

    const handleSubmission = async (e) => {
        const filteredJury = selectedJury?.filter(name => name !== 'Other');
        const juryNames = filteredJury?.join(', ');
        const filteredExtJury = descData.Tag?.filter(name => name !== 'Other');
        const extJuryNames = filteredExtJury?.join(', ');
        e.preventDefault()
        
        if (status === "Abstract" || status === "ReEvaluate") {
            const data = {
                Date: descData.dated,
                InternalJury: juryNames,
                ExternalJury: extJuryNames,
                Remarks: descData.Remarks,
                Reponse: selectedRemark,
                FypId: projectId,
            }
            if (!juryNames || !descData?.dated || !descData?.Remarks || !selectedRemark) {
                setEvalErr("Please fill all fields")
                return;
            }
            try {
                setBtnLoading(true)
                const response = await Axios.post("admin/addorupdateproposaldefence", data)
                if (response.status === 200) {
                    SuccessToaster("Remarks Uploaded")
                    handleClose()
                }
            }
            catch (err) {
                ErrorToaster("Something Went Wrong")
            }
            finally {
                fetchSupervisors()
                setBtnLoading(false)
            }

        }
        else if (status === "Fyp1") {
            const data = {
                Date: descData.dated,
                InternalJury: juryNames,
                ExternalJury: extJuryNames,
                Remarks: descData.Remarks,
                grades: memberGrades,
                FypId: projectId,
            };
            if (!juryNames || !descData.dated || !descData.Remarks || Object.values(memberGrades).some(grade => grade === '')) {
                setEvalErr("Please fill all fields");
                return;
            }
            try {
                const response = await Axios.post("admin/addorupdatemidevaluation", data)
                if (response.status === 200) {
                    SuccessToaster("Remarks Uploaded")
                    handleClose()
                }
            }
            catch (err) {
                ErrorToaster("Something Went Wrong")
            }
            finally {
                fetchSupervisors()
            }
        }
        else if (status === "Complete") {
            const data = {
                Date: descData.dated,
                InternalJury: juryNames,
                ExternalJury: extJuryNames,
                Remarks: descData.Remarks,
                grades: memberGrades,
                FypId: projectId,
            };
            
            if (!juryNames || !descData.dated || !descData.Remarks || Object.values(memberGrades).some(grade => grade === '')) {
                setEvalErr("Please fill all fields");
                return;
            }
            const blob = await pdf(<MyDocument data={data} members={members} />).toBlob();

            try {
                const response = await Axios.post("admin/addorupdatefinalevaluation", data)
                if (response.status === 200) {
                    SuccessToaster("Final Remarks Updated")
                    handleClose()
                }
                const formData = new FormData();
                formData.append('FypId', projectId);
                formData.append('Attachments', new File([blob], `Evaluation_${projectId}.pdf`, { type: 'application/pdf' }));
                const pdfResponse = await Axios.post('admin/emailevaluationresults', formData)
                console.log("pdfResponse : ", pdfResponse)
                if (pdfResponse.status === 200) {
                    SuccessToaster("Final Evaluation Response Emailed")
                }
            }
            catch (err) {
                ErrorToaster("Something Went Wrong")
            }
            finally {
                fetchSupervisors()
                navigate("/OnGoingProjects")
            }
        }
    }

    const addTag = (tag) => {
        setEvalErr(null)
        if (descData.Tag) {
            let newTag = [...descData.Tag, tag]
            setDescData({ ...descData, Tag: newTag });
        }
        else {
            setDescData({ ...descData, Tag: [tag] });
        }
    };

    const removeTag = (index) => {
        setDescData({ ...descData, Tag: descData?.Tag?.filter((_, i) => i !== index) });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={handleClose}>&times;</span>
                <div style={{ display: "flex", justifyContent: "center" }}><h5>{status === "Abstract" ? "Proposal Defence" :
                    status === "Fyp1" ? "Mid Evaluation" : status === "Fyp2" ? "Final Evaluation" : status === "ReEvaluation" ? "Re-Evaluate":null}</h5></div>
                <div className="row">
                    <div style={{ paddingBottom: "8px" }}>
                        <label>Date</label>
                        <input style={{
                            width: "100%", padding: "8px", marginBottom: "10px",
                            border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box"
                        }} type="date" name="dated" placeholder="Dated" value={descData.dated} onChange={(e) => { handleDescChange(e); setEvalErr(null) }} />
                    </div>
                    <div style={{ paddingBottom: "8px" }}>
                        <MultiSelect jury={jury} selectedJury={selectedJury} setSelectedJury={setSelectedJury} setEvalErr= {setEvalErr} />
                    </div>
                    {(selectedJury?.includes("Other") || descData.Tag?.length > 0) &&
                        <div style={{ paddingBottom: "4px" }}>
                            <label>Externals</label>
                            <TagsInput tags={descData?.Tag} addTag={addTag} removeTags={removeTag} />
                        </div>}
                    <div style={{ paddingBottom: "8px" }}>
                        <label>Jury Remarks</label>
                        <textarea type="text" className="form-control" name="Remarks" placeholder="Jury Remarks" value={descData?.Remarks} onChange={(e) => { handleDescChange(e); setEvalErr(null) }} />
                    </div>
                    {status === "Fyp1" ? (
                        <div style={{ paddingBottom: "8px" }}>
                            <label><strong>Grade</strong></label>
                            {Object.entries(members).map(([memberId, memberName]) => (
                                <div key={memberId} style={{ display: "flex", marginBottom: '8px' }}>
                                    <div style={{ width:"40%" }}>
                                        <label>{memberName}</label>
                                    </div>
                                    <div style={{ width: "60%" }}>
                                    <select
                                        className="form-control custom-select"
                                        value={memberGrades[memberId]}
                                        onChange={(e) => handleGradeChange(memberId, e.target.value)}
                                    >
                                        <option value="" disabled>Select Grade</option>
                                        <option value="A">A</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B">B</option>
                                        <option value="B-">B-</option>
                                        <option value="C+">C+</option>
                                        <option value="C">C</option>
                                        <option value="C-">C-</option>
                                        <option value="D">D</option>
                                    </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : status === "Complete" ? (
                            <div style={{ paddingBottom: "8px" }}>
                                <label><strong>Grade</strong></label>
                                {Object.entries(members).map(([memberId, memberName]) => (
                                    <div key={memberId} style={{ display: "flex", marginBottom: '8px' }}>
                                        <div style={{ width: "40%" }}>
                                            <label>{memberName}</label>
                                        </div>
                                        <div style={{ width: "60%" }}>
                                            <select
                                                className="form-control custom-select"
                                                value={memberGrades[memberId]}
                                                onChange={(e) => handleGradeChange(memberId, e.target.value)}
                                            >
                                                <option value="" disabled>Select Grade</option>
                                                <option value="A">A</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B">B</option>
                                                <option value="B-">B-</option>
                                                <option value="C+">C+</option>
                                                <option value="C">C</option>
                                                <option value="C-">C-</option>
                                                <option value="D">D</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ color: '#c71010', fontSize: '16px', backgroundColor: "lightgray" }}>You won't be able to revert changes after submission</div>
                            </div>
                    ) : status === "Abstract" ? (
                        <div style={{ paddingBottom: "8px" }}>
                            <label>Response</label>
                               <select className="form-control custom-select" value={selectedRemark} onChange={(e) => { setSelectedRemark(e.target.value); setEvalErr(null) }} style={{ marginRight: '8px' }}>
                                <option value="" disabled>Select Option</option>
                                <option value="Strong Approve">Strong Approve</option>
                                <option value="Weak Approve">Weak Approve</option>
                                <option value="ReEvaluate">ReEvaluate</option>
                                <option value="Reject">Reject</option>
                               </select>
                        </div>
                    ) :status === "ReEvaluate" ? (
                        <div style={{ paddingBottom: "8px" }}>
                            <label>Response</label>
                               <select className="form-control custom-select" value={selectedRemark} onChange={(e) => { setSelectedRemark(e.target.value); setEvalErr(null) }} style={{ marginRight: '8px' }}>
                                <option value="" disabled>Select Option</option>
                                <option value="Strong Approve">Strong Approve</option>
                                <option value="Weak Approve">Weak Approve</option>
                                <option value="ReEvaluate">ReEvaluate</option>
                                <option value="Reject">Reject</option>
                               </select>
                        </div>
                        ):null}
                    {evalErr && <div style={{ color: 'red', fontStyle: 'italic', fontSize: "14px", marginTop: '8px' }}>{evalErr}</div>}
                    {/*<button onClick={handleSubmission}>Submit</button>*/}
                    <button
                        type="button"
                        onClick={handleSubmission}
                        className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                        disabled={btnLoading}
                    >
                        {btnLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvaluationDialog;
