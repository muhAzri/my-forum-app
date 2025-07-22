export interface StatsData {
  label: string
  value: string | number
}

export interface FeatureCardData {
  title: string
  description: string
  content: string
  buttonText: string
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  onButtonClick?: () => void
}

export interface StatsCardData {
  title: string
  description: string
  stats: StatsData[]
}