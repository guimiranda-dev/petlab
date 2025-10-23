import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  line: {
    backgroundColor: '#EAEAEA',
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  examValuesRow: {
    flexDirection: 'row',
    gap: 62,
  },
  examValuesColumn: {
    gap: 2,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 11,
    marginBottom: 2,
  },
  mediumTitle: {
    fontSize: 14,
    fontWeight: 'bold',
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
  smallTitle: {
    fontSize: 12,
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
  logo: {
    width: 180,
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
