/* eslint-disable jsx-a11y/alt-text */
import { Image, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

export function ExamFooter() {
  return (
    <View style={styles.signContainer}>
      <Text style={styles.description}>Assinado eletronicamente por:</Text>
      <Image style={styles.signImage} src='/assets/signature.png' />
      <Text style={styles.description}>Médica Veterinária</Text>
      <Text style={styles.description}>Gabrielle S. S. Shibata - CRMV/MG 23824</Text>
    </View>
  );
}
