import { ExamFormProps } from '@/types/exam';
import { Text, View } from '@react-pdf/renderer';
import { DateTime } from 'luxon';
import { styles } from './styles';

interface Props {
  values: ExamFormProps;
}

export function ExamInfo({ values }: Props) {
  function mountAgeText() {
    if (!values.pet) {
      return 'Selecione um pet';
    }
    const birthDate = new Date(values?.pet?.birth_date);
    const today = values.date ? new Date(values.date) : new Date();
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
  );
}
