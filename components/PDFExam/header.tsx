/* eslint-disable jsx-a11y/alt-text */
import { Image, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

export function ExamHeader() {
  return (
    <View style={{ marginTop: -24 }}>
      <Image
        style={{
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        src='/assets/pdf-header.png'
      />
      <Image style={styles.logo} src='/assets/mini-logo-pdf.png' />
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={{ ...styles.headerText, fontWeight: 'bold' }}>
            Clínica veterinária Almanaque Pet
          </Text>
          <Text style={styles.headerText}>Avenida Antônio Carlos 42 Jardim Cascatinha</Text>
          <Text style={styles.headerText}>Poços de Caldas/MG - CEP: 37701-166 </Text>
          <Text style={styles.headerText}>(35) 99896-3086 - (35) 3014-3086</Text>
        </View>
      </View>
    </View>
  );
}
