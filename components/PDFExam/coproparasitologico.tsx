import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { ExamFormProps } from '@/types/exam';
import { ExamType, ExamTypeMap } from '@/types/exam_types';
import { ExamHeader } from '@/components/PDFExam/header';
import { ExamInfo } from './examInfo';
import { ExamFooter } from './footer';
import { styles } from './styles';
import { ExamReferences } from './examReferences';

interface Props {
  values: ExamFormProps;
}

const PDFFile = ({ values }: Props) => {
  const results = values.exams.values.filter((exam) => Boolean(exam) && Boolean(exam.value));

  return (
    <Document>
      <Page style={{ paddingVertical: 24 }}>
        <ExamHeader />
        <View style={styles.body}>
          <ExamInfo values={values} />

          <View style={styles.line} />
          <Text style={styles.title}>{ExamTypeMap[ExamType.coproparasitologico].label}</Text>
          <View style={styles.line} />
          <Text style={{ ...styles.smallTitle, marginTop: 12 }}>
            Exame coproparasitológico realizado pela técnica de flutuação (Willis-Mollay), com
            avaliação microscópica qualitativa para pesquisa de ovos, oocistos, cistos, larvas e
            demais estruturas parasitárias
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

          {results.map((exam) => (
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

          {values.obs && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ ...styles.mediumTitle, marginBottom: 6 }}>Observações</Text>
              <Text style={styles.description}>{values.obs}</Text>
            </View>
          )}

          <ExamFooter />
          <ExamReferences type={ExamType.coproparasitologico} />
        </View>
      </Page>
    </Document>
  );
};

export default PDFFile;
