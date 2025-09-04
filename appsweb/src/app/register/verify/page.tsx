import VerifyForm from './VerifyForm'
import { Suspense } from 'react'

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyForm />
    </Suspense>
  )
}
