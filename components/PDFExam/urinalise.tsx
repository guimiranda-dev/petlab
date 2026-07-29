import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { ExamFormProps } from '@/types/exam';
import { ExamType, ExamTypeMap } from '@/types/exam_types';
import { ExamHeader } from '@/components/PDFExam/header';
import { ExamInfo } from './examInfo';
import { ExamFooter } from './footer';
import { styles } from './styles';
import { ExamReferences } from './examReferences';
import { ExamSubgroup } from '@/types/exam_subgroup';

interface Props {
  values: ExamFormProps;
}

function groupExamsBySubgroup(exams: ExamFormProps['exams']['values']) {
  return exams
    .filter((exam) => Boolean(exam) && exam.value !== null && exam.value !== undefined)
    .reduce<Record<string, ExamFormProps['exams']['values']>>((groups, exam) => {
      const subgroupName = exam.exam_subgroup || 'Outros';

      if (!groups[subgroupName]) {
        groups[subgroupName] = [];
      }

      groups[subgroupName].push(exam);
      return groups;
    }, {});
}

const PDFFile = ({ values }: Props) => {
  const groupedExams = groupExamsBySubgroup(values.exams.values);

  return (
    <Document>
      <Page style={{ paddingVertical: 24 }}>
        <ExamHeader />
        <View style={styles.body}>
          <ExamInfo values={values} />

          <View style={styles.line} />
          <Text style={styles.title}>{ExamTypeMap[ExamType.urinalise].label}</Text>
          <View style={styles.line} />

          {Object.entries(groupedExams).map(([subgroupName, exams]) => (
            <View key={subgroupName}>
              <Text style={[styles.mediumTitle, { marginVertical: 8 }]}>
                {ExamSubgroup[subgroupName as keyof typeof ExamSubgroup] || subgroupName}
              </Text>

              <View wrap={false}>
                <View style={{ ...styles.examValuesRow, alignItems: 'flex-end' }}>
                  <View style={{ ...styles.examValuesColumn, alignItems: 'flex-start' }} />
                  <View style={styles.examValuesColumn}>
                    <Text style={styles.description}>Valor Obtido</Text>
                  </View>
                  <View style={styles.examValuesColumn}>
                    <Text style={styles.description}>Valor de Referência</Text>
                  </View>
                </View>
                <View style={styles.line} />
              </View>

              {exams.map((exam) => (
                <View key={exam.exam_reference_id} wrap={false}>
                  <View style={styles.examValuesRow}>
                    <View style={{ ...styles.examValuesColumn, alignItems: 'flex-start' }}>
                      <Text style={styles.smallTitle}>{exam.name}</Text>
                    </View>
                    <View style={styles.examValuesColumn}>
                      <Text style={styles.value}>
                        {exam.value}
                        {exam.unit ? ` ${exam.unit}` : ''}
                      </Text>
                    </View>
                    <View style={styles.examValuesColumn}>
                      <Text style={styles.value}>
                        {exam.reference_value || 'N/A'}
                        {exam.reference_value && exam.unit ? ` ${exam.unit}` : ''}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.line} />
                </View>
              ))}
            </View>
          ))}

          {values.obs && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ ...styles.mediumTitle, marginBottom: 6 }}>Observações</Text>
              <Text style={styles.description}>{values.obs}</Text>
            </View>
          )}

          <ExamFooter />
          <ExamReferences type={ExamType.urinalise} />
        </View>
      </Page>
    </Document>
  );
};

export default PDFFile;
