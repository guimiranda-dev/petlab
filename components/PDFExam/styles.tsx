import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  body: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
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
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#388d9b',
  },
  description: {
    fontSize: 6,
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
    textAlign: 'right',
    height: 70,
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
  headerInfo: {
    justifyContent: 'flex-end',
    marginRight: 18,
    textAlign: 'right',
    marginTop: 16,
    gap: 2,
  },
  headerText: {
    fontSize: 8,
    textAlign: 'right',
    color: '#FFFFFF',
    justifyContent: 'flex-end',
  },
  logo: {
    width: 100,
    position: 'absolute',
    top: 20,
    left: 48,
  },
  signImage: {
    width: 80,
  },
  signContainer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
});
