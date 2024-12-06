import { FC, ReactNode } from 'react'
import Header from './header'
import Sidebar from './sidebar'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
