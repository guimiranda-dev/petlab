import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { ExamFormProps } from '@/types/exam';
import { ExamTypeMap } from '@/types/exam_types';
import { ExamHeader } from '@/components/PDFExam/header';
import { ExamInfo } from './examInfo';
import { ExamFooter } from './footer';
import { styles } from './styles';
import { ExamSubgroup } from '@/types/exam_subgroup';

interface Props {
  values: ExamFormProps;
}

function groupExamsBySubgroup(exams: ExamFormProps['exams']['values']) {
  const grouped = exams
    .filter((exam) => Boolean(exam) && exam.value !== null && exam.value !== undefined)
    .reduce(
      (acc, exam) => {
        const subgroupName = exam.exam_subgroup || 'Outros';

        if (!acc[subgroupName]) {
          acc[subgroupName] = [];
        }

        acc[subgroupName].push(exam);
        return acc;
      },
      {} as Record<string, any[]>,
    );

  return grouped;
}

const PDFFile = ({ values }: Props) => {
  const groupedExams = groupExamsBySubgroup(values.exams.values);

  return (
    <Document>
      <Page style={styles.body}>
        <ExamHeader />

        <View style={styles.line}></View>

        <ExamInfo values={values} />

        <View style={styles.line}></View>

        <Text style={styles.title}>
          {values.exams.type ? ExamTypeMap[values.exams.type].label : 'Selecione um exame'}
        </Text>

        <View style={styles.line}></View>

        {Object.entries(groupedExams).map(([subgroupName, exams]) => (
          <View key={subgroupName} wrap={false}>
            <Text style={[styles.mediumTitle, { marginBottom: 8 }]}>
              {ExamSubgroup[subgroupName as keyof typeof ExamSubgroup] || subgroupName}
            </Text>

            {exams.map((exam, idx) => (
              <View key={idx} wrap={false}>
                <View>
                  <View style={{ ...styles.examValuesRow, alignItems: 'flex-end' }}>
                    <View style={{ ...styles.examValuesColumn, alignItems: 'flex-start' }}>
                      <Text style={{ ...styles.smallTitle, textAlign: 'left' }}>{exam.name}</Text>
                    </View>

                    <View style={styles.examValuesColumn}>
                      <Text style={styles.description}>Valores Obtidos</Text>
                      <Text style={styles.value}>
                        {exam.relative_value !== null ? `${exam.relative_value} % | ` : ''}{' '}
                        {exam?.value} {exam?.unit}
                      </Text>
                    </View>

                    <View style={styles.examValuesColumn}>
                      <Text style={styles.description}>Valores de Referência</Text>
                      <Text style={styles.value}>
                        {exam.reference_relative_value !== null
                          ? `${exam.reference_relative_value} % | `
                          : ''}{' '}
                        {exam?.reference_value} {exam?.unit}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.line}></View>
              </View>
            ))}
          </View>
        ))}

        <ExamFooter />
      </Page>
    </Document>
  );
};

export default PDFFile;
