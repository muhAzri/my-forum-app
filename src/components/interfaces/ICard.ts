export interface IBaseCard {
  title: string
  description: string
}

export interface IActionableCard extends IBaseCard {
  buttonText: string
  onButtonClick?: () => void
}

export interface IContentCard extends IBaseCard {
  content: string
}

export interface IDataCard extends IBaseCard {
  // For cards that display structured data
  data?: Record<string, unknown>
}