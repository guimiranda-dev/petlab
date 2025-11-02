import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { ExamType } from '@/types/exam_types';

export function ExamReferences({ type }: { type: ExamType }) {
  const hemograma = (
    <View style={{ marginTop: 48 }}>
      <Text style={styles.references}>
        THRALL, M. A.; WEISER, G.; ALLISON, R. W.; CAMPBELL, T. W. Hematologia e Bioquímica Clínica
        Veterinária. 2ª ed. Rio de Janeiro: Guanabara Koogan, 2015.
      </Text>
      <Text style={styles.references}>
        MEYER, D. J.; HARVEY, J. W. Veterinary Laboratory Medicine: Interpretation and Diagnosis.
        4th ed. St. Louis: Elsevier, 2020.
      </Text>
      <Text style={styles.references}>
        COLES, E. H. Veterinary Clinical Pathology. 4th ed. Philadelphia: W.B. Saunders, 1986.
      </Text>
      <Text style={styles.references}>
        RADOSTITS, O. M.; GAY, C. C.; HINCHCLIFFE, V.; CONSTABLE, P. D. Veterinary Medicine: A
        Textbook of the Diseases of Cattle, Horses, Sheep, Pigs, and Goats. 10th ed. Saunders, 2007.
      </Text>
      <Text style={styles.references}>
        KANEKO, J. J.; HARVEY, J. W.; BRUSS, M. L. Clinical Biochemistry of Domestic Animals. 6th
        ed. Academic Press, 2008.
      </Text>
      <Text style={styles.references}>
        ETTINGER, S. J.; FELDMAN, E. C. Textbook of Veterinary Internal Medicine. 8th ed. Elsevier,
        2017.
      </Text>
    </View>
  );

  const urinalise = (
    <View style={{ marginTop: 48 }}>
      <Text style={styles.references}>
        THRALL, M. A.; WEISER, G.; ALLISON, R. W.; CAMPBELL, T. W. Hematologia e Bioquímica Clínica
        Veterinária. 3ª ed. Elsevier, 2022.
      </Text>
      <Text style={styles.references}>
        KANEKO, J. J.; HARVEY, J. W.; BRUSS, M. L. Clinical Biochemistry of Domestic Animals. 6th
        ed. Academic Press, 2008.
      </Text>
      <Text style={styles.references}>
        ETTINGER, S. J.; FELDMAN, E. C. Tratado de Medicina Interna Veterinária. 8ª ed. Guanabara
        Koogan, 2017.
      </Text>
      <Text style={styles.references}>
        LOPES, S. T. A.; BIONDO, A. W.; SANTOS, A. P. Patologia Clínica Veterinária. 3ª ed. UFSM,
        2017.
      </Text>
    </View>
  );

  const coproparasitologico = (
    <View style={{ marginTop: 48 }}>
      <Text style={styles.references}>
        LOPES, S. T. A.; BIONDO, A. W.; SANTOS, A. P. Patologia Clínica Veterinária. 3ª ed. Santa
        Maria: Editora UFSM, 2017.
      </Text>
      <Text style={styles.references}>
        URQUHART, G. M.; ARMOUR, J.; DUNCAN, J. L.; DUNN, A. M.; JENNINGS, F. W. Parasitologia
        Veterinária. 2ª ed. Rio de Janeiro: Guanabara Koogan, 1998.
      </Text>
      <Text style={styles.references}>
        TAYLOR, M. A.; COOP, R. L.; WALL, R. L. Veterinary Parasitology. 4th ed. Hoboken:
        Wiley-Blackwell, 2016.
      </Text>
      <Text style={styles.references}>
        FOREYT, W. J. Veterinary Parasitology Reference Manual. 6th ed. Ames: Iowa State University
        Press, 2013.
      </Text>
      <Text style={styles.references}>
        ZAJAC, A. M.; CONBOY, G. A. Veterinary Clinical Parasitology. 9th ed. Ames: Wiley-Blackwell,
        2012
      </Text>
    </View>
  );

  const reticulocitos = (
    <View style={{ marginTop: 48 }}>
      <Text style={styles.references}>
        THRALL, M. A.; WEISER, G.; ALLISON, R. W.; CAMPBELL, T. W. Hematologia e Bioquímica Clínica
        Veterinária. 3ª ed. Elsevier, 2022.
      </Text>
      <Text style={styles.references}>
        MEYER, D. J.; HARVEY, J. W. Veterinary Laboratory Medicine: Interpretation and Diagnosis.
        4th ed. St. Louis: Elsevier, 2020.
      </Text>
      <Text style={styles.references}>
        COLES, E. H. Veterinary Clinical Pathology. 4th ed. Philadelphia: W.B. Saunders, 1986.
      </Text>
      <Text style={styles.references}>
        KANEO, J. J.; HARVEY, J. W.; BRUSS, M. L. Clinical Biochemistry of Domestic Animals. 6th ed.
        Academic Press, 2008.
      </Text>
      <Text style={styles.references}>
        FELDMAN, E. C.; ZINKL, J. G.; JAIN, N. C. Schalm’s Veterinary Hematology. 7th ed. Ames:
        Wiley-Blackwell, 2015.
      </Text>
    </View>
  );

  return (
    <View wrap={false}>
      {(type === ExamType.hemograma || type === ExamType.bioquimico) && hemograma}
      {type === ExamType.urinalise && urinalise}
      {type === ExamType.coproparasitologico && coproparasitologico}
      {type === ExamType.reticulocitos && reticulocitos}
    </View>
  );
}
