/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Svg,
  Path,
  PDFViewer,
} from '@react-pdf/renderer';
import { ExamFormProps } from '@/types/exam';
import { DateTime } from 'luxon';
import { ExamType } from '@/types/exam_types';
import { Spinner } from '@heroui/spinner';

interface Props {
  values: ExamFormProps;
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCard: {
    borderColor: '#6eaeb7',
    borderWidth: 2,
    borderRadius: 5,
    padding: 12,
    width: 290,
    gap: 2,
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLineImage: {
    width: 16,
    height: 16,
  },
  headerText: {
    fontSize: 12,
    textAlign: 'left',
    color: '#777777',
  },
  line: {
    backgroundColor: '#EAEAEA',
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  logo: {
    width: 180,
  },
  textLine: {
    flexDirection: 'row',
    gap: 2,
  },
  info: {
    flexDirection: 'row',
    gap: 62,
  },
  columnInfo: {
    gap: 8,
  },
  examValuesRow: {
    flexDirection: 'row',
    gap: 62,
    marginTop: 12,
  },
  examValuesColumn: {
    gap: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 9,
    marginBottom: 2,
  },
  mediumTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  smallTitle: {
    fontSize: 10,
  },
  signImage: {
    width: 200,
  },
  signContainer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 48,
  },
});

// Create Document Component
const PDFFile = ({ values }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentValues, setCurrentValues] = useState(values);

  useEffect(() => {
    // Mostra o loader
    setIsLoading(true);

    // Pequeno delay para garantir que o loader apareça
    const timer = setTimeout(() => {
      setCurrentValues(values);
      setIsLoading(false);
    }, 10000); // 300ms de delay

    return () => clearTimeout(timer);
  }, [values]);

  function mountAgeText() {
    if (!values.pet) {
      return 'Selecione um pet';
    }
    const birthDate = new Date(values?.pet?.birth_date);
    const today = new Date();
    const ageInMilliseconds = today.getTime() - birthDate.getTime();
    let age = ageInMilliseconds / (1000 * 60 * 60 * 24 * 30);

    if (age > 1 && age < 12) return `${Math.floor(age)} meses`;

    if (age === 1) return `${Math.floor(age)} mês`;

    age = age / 12;

    if (age === 12) return `${Math.floor(age)} ano`;

    return `${Math.floor(age)} anos`;
  }

  const ageText = mountAgeText();

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <Image style={styles.logo} src='/assets/logo.png' />
          <View style={styles.headerCard}>
            <View style={styles.headerLine}>
              <Svg viewBox='0 0 640 640' style={{ width: 12, height: 12 }}>
                <Path
                  d='M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z'
                  fill='#6eaeb7'
                />
              </Svg>
              <View>
                <Text style={styles.headerText}>Av. Antônio Carlos, nº 42 - Jardim Cascatinha</Text>
                <Text style={styles.headerText}>Poços de Caldas/MG - CEP: 37701-166</Text>
              </View>
            </View>

            <View style={styles.headerLine}>
              <Svg viewBox='0 0 640 640' style={{ width: 12, height: 12 }}>
                <Path
                  d='M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z'
                  fill='#6eaeb7'
                />
              </Svg>
              <Text style={styles.headerText}>Tel: (35) 3014-3086 / (35) 99896-3086</Text>
            </View>

            <View style={styles.headerLine}>
              <Svg viewBox='0 0 640 640' style={{ width: 12, height: 12 }}>
                <Path
                  d='M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z'
                  fill='#6eaeb7'
                />
              </Svg>
              <Text style={styles.headerText}>almanaquepetvet@gmail.com</Text>
            </View>

            <View style={styles.headerLine}>
              <Svg viewBox='0 0 640 640' style={{ width: 12, height: 12 }}>
                <Path
                  d='M415.9 344L225 344C227.9 408.5 242.2 467.9 262.5 511.4C273.9 535.9 286.2 553.2 297.6 563.8C308.8 574.3 316.5 576 320.5 576C324.5 576 332.2 574.3 343.4 563.8C354.8 553.2 367.1 535.8 378.5 511.4C398.8 467.9 413.1 408.5 416 344zM224.9 296L415.8 296C413 231.5 398.7 172.1 378.4 128.6C367 104.2 354.7 86.8 343.3 76.2C332.1 65.7 324.4 64 320.4 64C316.4 64 308.7 65.7 297.5 76.2C286.1 86.8 273.8 104.2 262.4 128.6C242.1 172.1 227.8 231.5 224.9 296zM176.9 296C180.4 210.4 202.5 130.9 234.8 78.7C142.7 111.3 74.9 195.2 65.5 296L176.9 296zM65.5 344C74.9 444.8 142.7 528.7 234.8 561.3C202.5 509.1 180.4 429.6 176.9 344L65.5 344zM463.9 344C460.4 429.6 438.3 509.1 406 561.3C498.1 528.6 565.9 444.8 575.3 344L463.9 344zM575.3 296C565.9 195.2 498.1 111.3 406 78.7C438.3 130.9 460.4 210.4 463.9 296L575.3 296z'
                  fill='#6eaeb7'
                />
              </Svg>
              <Text style={styles.headerText}>almanaquepet.com</Text>
            </View>
          </View>
        </View>
        <View style={styles.line}></View>

        <View style={styles.info}>
          <View style={styles.columnInfo}>
            <View style={styles.textLine}>
              <Text style={styles.smallTitle}>Tutor:</Text>
              <Text style={styles.value}>{values?.owner?.name || 'Selecione um tutor'}</Text>
            </View>

            <View style={styles.textLine}>
              <Text style={styles.smallTitle}>Nome do animal:</Text>
              <Text style={styles.value}>{values.pet?.name || 'Selecione um pet'}</Text>
            </View>

            <View style={styles.textLine}>
              <Text style={styles.smallTitle}>Sexo:</Text>
              <Text style={styles.value}>{values.pet?.gender || 'Selecione um pet'}</Text>
            </View>

            <View style={styles.textLine}>
              <Text style={styles.smallTitle}>Raça:</Text>
              <Text style={styles.value}>{values.pet?.breed || 'Selecione um pet'}</Text>
            </View>
          </View>

          <View style={styles.columnInfo}>
            <View style={styles.textLine}>
              <Text style={styles.smallTitle}>Espécie:</Text>
              <Text style={styles.value}>{values.pet?.specie || 'Selecione um pet'}</Text>
            </View>

            <View style={styles.textLine}>
              <Text style={styles.smallTitle}>Idade:</Text>
              <Text style={styles.value}>{ageText}</Text>
            </View>

            <View style={styles.textLine}>
              <Text style={styles.smallTitle}>Data:</Text>
              <Text style={styles.value}>
                {values.date
                  ? DateTime.fromISO(values.date).toFormat('dd/MM/yyyy')
                  : 'Selecione uma data'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.line}></View>

        <Text style={styles.title}>
          {values.exams.type
            ? ExamType[values.exams.type as unknown as keyof typeof ExamType]
            : 'Selecione um exame'}
        </Text>

        <View style={styles.line}></View>

        {values.exams.values
          .filter((v) => Boolean(v))
          .map((exam, idx) => (
            <View key={idx} wrap={false}>
              <View>
                <Text style={[styles.mediumTitle, { marginBottom: 4 }]}>{exam.name}</Text>

                <View style={styles.examValuesRow}>
                  <View style={styles.examValuesColumn}>
                    <Text style={styles.description}>Amostra: Soro</Text>
                    <Text style={styles.description}>Método: Jaffé - não modificado</Text>
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

        <View style={styles.signContainer}>
          <Text style={styles.description}>Assinado eletronicamente por:</Text>
          <Image style={styles.signImage} src='/assets/signature.png' />
          <Text style={styles.description}>Médica Veterinária</Text>
          <Text style={styles.description}>Gabrielle S. S. Shibata - CRMV/MG 23824</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFFile;
