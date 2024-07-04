export enum CsvItemTypeEnum {
  CREDIT = 'Credito',
  DEBIT = 'Debito'
}

export enum CsvItemCategoryEnum {
  JCP = 'Juros Sobre Capital Próprio',
  DIVIDEND = 'Dividendo',
  LIQUIDATION = 'Transferência - Liquidação',
  INCOME = 'Rendimento',
  UPDATE = 'Atualização',
  SPREAD = 'Desdobro',
  GROUPING = 'Grupamento',
  FRACTION = 'Fração em Ativos',
  FRACTION_SALE = 'Leilão de Fração',
  SUBSCRIPTION = 'Direitos de Subscrição - Excercído',
  BONUS = 'Bonificação em Ativos',
}

export class CsvItem {
  public type: CsvItemTypeEnum
  public date: Date
  public category: CsvItemCategoryEnum
  public ticker: string
  public institution: string
  public broker: string
  public quantity: number
  public price: number
  public grossValue: number

  constructor(data: CsvItem) {
    Object.assign(this, data)
  }
}