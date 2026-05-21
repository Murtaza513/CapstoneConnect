// MomPdfDocument.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Custom font (optional)
// import myFont from './path-to-your-font.ttf';
// Font.register({ family: 'MyFont', src: myFont });

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    title: {
        textAlign: 'left',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0077c8',
    },
    sectionTitle: {
        fontSize: 12,
        margin: 10,
        marginTop: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#0077c8',
    },
    subSectionTitle: {
        fontSize: 12,
        marginTop: 10,
        fontWeight: 'bold',
        color: '#000',
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        padding: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        flex: 1,
    },
    tableHeader: {
        backgroundColor: '#f1f1f1',
        fontWeight: 'bold',
    },
    textBold: {
        fontWeight: 'bold',
    },
    list: {
        margin: 0,
        paddingLeft: 10,
    },
    listItem: {
        fontSize: 10,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    meetingDetails: {
        textAlign: 'right',
        fontSize: 10,
    },
    headerTitle: {
        fontSize: 18,
        color: '#0077c8',
        fontWeight: 'bold',
    },
    headerRight: {
        textAlign: 'right',
        marginBottom: 10,
    },
    textItalic: {
        fontStyle: 'italic',
    },
    underline: {
        textDecoration: 'underline',
    }
});

const MomPdfDetail = ({ momData }) => (
    <Document>
        {momData&&
        <Page style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>FYP Project Meeting #{momData.meetingNumber}</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.textBold}>Minutes of Meeting</Text>
                    <Text style={styles.meetingDetails}>Meeting Date: {new Date(momData.date).toLocaleDateString()}</Text>
                    <Text style={styles.meetingDetails}>Meeting Location: {momData.location}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>1- List of Participants</Text>
            <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCell}>Name</Text>
                    {/*<Text style={styles.tableCell}>Project Role</Text>*/}
                </View>
                {momData.listOfParticipants.split(',').map((participant, index) => (
                    <View style={styles.tableRow} key={index}>
                        <Text style={styles.tableCell}>{participant.trim()}</Text>
                        {/*<Text style={styles.tableCell}></Text>*/}
                    </View>
                ))}
            </View>

            <Text style={styles.sectionTitle}>2- Meeting Agenda</Text>
            <View style={styles.list}>
                <Text style={styles.listItem}>- {momData.agenda}</Text>
            </View>

            <Text style={styles.sectionTitle}>3- Agenda Points discussed in meeting</Text>
            <Text>{momData.description}</Text>

            {/*<Text style={styles.sectionTitle}>4- Action List</Text>
            <View style={styles.list}>
                <Text style={styles.listItem}>• 1</Text>
                <Text style={styles.listItem}>• 2</Text>
            </View>*/}
            </Page>
        }
    </Document>
);

export default MomPdfDetail;
