'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CsvItem, CsvItemCategoryEnum, CsvItemTypeEnum } from '@/models/csv-file'
import { Github, ImageUp, Linkedin, Mail } from 'lucide-react'
import { FormEvent } from 'react'

export default function Home() {
  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('Form submitted')

    const form = document.getElementById('formUpload')
    const formData = new FormData(form as HTMLFormElement)
    const csvFile = formData.get('csvFile')

    const content = await normalizeCsvFile(csvFile as Blob)

    console.log(content)
  }

  return (
    <main className='w-full h-full px-4 py-8 flex flex-col justify-start items-start gap-4'>
      <h1 className='w-full text-3xl text-foreground font-bold text-center'> Imagem para Texto</h1>
      <span className='w-full text-base text-muted text-center'>Envie uma imagem para gerar descrições alternativas dela</span>
      {true && (
        <div className='w-full flex flex-col justify-center items-center gap-4'>
          <form
            id="formUpload"
            onSubmit={(e) => handleFormSubmit(e)}
            className='w-full flex flex-col justify-start items-start gap-4 sm:flex-row sm:justify-center sm:items-center'
          >
            {/* CSV Input */}
            <div className="flex w-full mt-2 justify-center items-center gap-1.5">
              <Label
                htmlFor="csvFile"
                className={'w-full h-[280px] flex flex-row justify-center items-center border-[1.5px] rounded-xl cursor-pointer'}
              >
                <div className='flex flex-col justify-center items-center gap-4'>
                  <ImageUp className="h-20 w-20 stroke-muted stroke-1" />
                  <p className='text-base text-muted'>Toque para enviar um arquivo</p>
                </div>
              </Label>
              <Input
                id="csvFile"
                name='csvFile'
                type="file"
                accept="csv"
                required
                className="hidden"
              />
              <Button type='submit' className='w-full mt-4'>Analisar</Button>
            </div>
          </form>
        </div>
      )}

      <p className='w-full mt-8 text-base text-muted text-center'>Desenvolvido por <span className="text-primary text-lg font-bold">Thiago Elias</span>
      </p>
      <nav className='w-full'>
        <ul className='w-full flex justify-center items-center gap-2'>
          <li className='cursor-pointer'><a target='blank' href='mailto:thiagoelias99@gmail.com' className='w-8 h-8 rounded-full flex justify-center items-center'><Mail className='w-6 h-6 stroke-red-600' /></a></li>
          <li className='cursor-pointer'><a target='blank' href='https://github.com/thiagoelias99' className='w-8 h-8 rounded-full flex justify-center items-center'><Github className='w-6 h-6' /></a></li>
          <li className='cursor-pointer'><a target='blank' href='https://www.linkedin.com/in/eng-thiagoelias/' className='w-8 h-8 bg-[#4066bb] rounded flex justify-center items-center'><Linkedin className='w-6 h-6 stroke-1  stroke-white fill-white' /></a></li>
        </ul>
      </nav>
    </main>
  )
}

async function normalizeCsvFile(file: Blob) {
  const fileContent = new Promise((resolve) => {
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.readAsText(file)

    reader.onloadend = () => {
      const fileContent = reader!.result!.toString().split('\n')

      //Normalize the data from .csv
      const objects = fileContent.map((line) => {
        if (!line) return

        const lineData = line.split(';')
        const [day, month, year] = (lineData[1].split('/'))
        const [ticker, institution] = lineData[3].split(' - ')

        const item = new CsvItem({
          type: lineData[0] as CsvItemTypeEnum,
          date: new Date(Number(year), Number(month) - 1, Number(day), 12),
          category: lineData[2] as CsvItemCategoryEnum,
          ticker,
          institution,
          broker: lineData[4],
          quantity: Number(lineData[5].trim().replace('.', '').replace(',', '.').replace('R$', '')) || 0,
          price: Number(lineData[6].trim().replace('.', '').replace(',', '.').replace('R$', '')) || 0,
          grossValue: Number(lineData[7].trim().replace('.', '').replace(',', '.').replace('R$', '').replace('\r', '')) || 0
        })

        return item
      })


      resolve(objects)
    }
  })

  return await fileContent
}