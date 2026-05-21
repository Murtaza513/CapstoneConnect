//import React, { PureComponent } from 'react';
//import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

//const data = [
//    {
//        subject: 'Research',
//        A: 120,
//        B: 110,
//        fullMark: 150,
//    },
//    {
//        subject: 'Ui Ux',
//        A: 98,
//        B: 130,
//        fullMark: 150,
//    },
//    {
//        subject: 'Development',
//        A: 86,
//        B: 130,
//        fullMark: 150,
//    },
//    {
//        subject: 'DataBase',
//        A: 99,
//        B: 100,
//        fullMark: 150,
//    },
//    {
//        subject: 'Backend',
//        A: 85,
//        B: 90,
//        fullMark: 150,
//    },
//    {
//        subject: 'Testing',
//        A: 65,
//        B: 85,
//        fullMark: 150,
//    },
//];

//export default class Example extends PureComponent {
//    static demoUrl = 'https://codesandbox.io/s/simple-radar-chart-rjoc6';

//    render() {
//        return (
//            <ResponsiveContainer width="100%" height="100%">
//                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                    <PolarGrid />
//                    <PolarAngleAxis dataKey="subject" tick={{ dy: 5, fontSize: 12 }} /> {/* Adjust dy and fontSize */}
//                    <PolarRadiusAxis />
//                    <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
//                </RadarChart>
//            </ResponsiveContainer>
//        );
//    }
//}
