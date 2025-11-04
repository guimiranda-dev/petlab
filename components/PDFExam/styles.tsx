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
    marginVertical: 4,
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
    fontSize: 8,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#388d9b',
  },
  description: {
    fontSize: 8,
    marginBottom: 2,
  },
  references: {
    fontSize: 6,
    marginBottom: 4,
  },
  mediumTitle: {
    fontSize: 9,
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
    fontSize: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCard: {
    borderColor: '#388d9b',
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
    fontSize: 8,
    textAlign: 'left',
    color: '#777777',
  },
  logo: {
    width: 90,
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
