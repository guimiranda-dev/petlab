import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { ExamFormProps } from '@/types/exam';
import { ExamType, ExamTypeMap } from '@/types/exam_types';
import { ExamHeader } from '@/components/PDFExam/header';
import { ExamInfo } from './examInfo';
import { ExamFooter } from './footer';
import { styles } from './styles';

interface Props {
  values: ExamFormProps;
}

// Create Document Component
const PDFFile = ({ values }: Props) => {
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

        {values.exams.values
          .filter((v) => Boolean(v) && Boolean(v.value))
          .map((exam, idx) => (
            <View key={idx} wrap={false}>
              <View>
                <Text style={[styles.mediumTitle, { marginBottom: 4 }]}>{exam.name}</Text>

                <View style={styles.examValuesRow}>
                  <View
                    style={{
                      ...styles.examValuesColumn,
                      textAlign: 'left',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text style={styles.description}>Amostra: {exam.sample_type}</Text>
                    <Text style={styles.description}>Método: {exam.method}</Text>
                  </View>

                  <View style={styles.examValuesColumn}>
                    <Text style={styles.description}>Valores Obtidos</Text>
                    <Text style={styles.value}>{exam?.value || '-'}</Text>
                  </View>

                  <View style={styles.examValuesColumn}>
                    <Text style={styles.description}>Valores de Referência</Text>
                    <Text style={styles.value}>{exam?.reference_value}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.line}></View>
            </View>
          ))}

        <ExamFooter />
      </Page>
    </Document>
  );
};

export default PDFFile;
