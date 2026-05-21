// TablePDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20,
        fontSize: 10,
        lineHeight: 1.2, // Adjust the line height for better spacing
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderCollapse: 'collapse', // Add border collapse for proper spacing
    },
    tableRow: {
        flexDirection: 'row',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderColor: '#bfbfbf',
    },
    tableCell: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        padding: 5,
        textAlign: 'left',
        flexGrow: 1,
    },
    header: {
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0', // Add a background color for headers
    },
    col1: {
        width: '10%',
    },
    col2: {
        width: '15%',
    },
    col3: {
        width: '25%',
    },
    col4: {
        width: '25%',
    },
    col5: {
        width: '10%',
    },
    col6: {
        width: '10%',
    },
    col7: {
        width: '10%',
    },
});

// Create Document Component
const MomPdf = ({ projects }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.title}>Fortnightly Sheet</Text>
            <View style={styles.table}>
                <View style={[styles.tableRow, styles.header]}>
                    <Text style={[styles.tableCell, styles.col1]}>Meeting #</Text>
                    <Text style={[styles.tableCell, styles.col2]}>Date</Text>
                    <Text style={[styles.tableCell, styles.col3]}>Agenda (Brief Statement)</Text>
                    <Text style={[styles.tableCell, styles.col4]}>Attended By</Text>
                    <Text style={[styles.tableCell, styles.col5]}>Supervisor's Sign</Text>
                    <Text style={[styles.tableCell, styles.col6]}>Co-supervisor's Sign</Text>
                </View>
                {projects.map((project, index) => (
                    <View style={styles.tableRow} key={project.id}>
                        <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
                        <Text style={[styles.tableCell, styles.col2]}>{project.date}</Text>
                        <Text style={[styles.tableCell, styles.col3]}>{project.agenda}</Text>
                        <Text style={[styles.tableCell, styles.col4]}>{project.attendedBy.join(', ')}</Text>
                        <Text style={[styles.tableCell, styles.col5]}></Text>
                        <Text style={[styles.tableCell, styles.col6]}></Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default MomPdf;
