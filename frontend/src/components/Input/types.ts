export type InputProps = {
    type?: string,
    placeholder: string,
    value: string
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}