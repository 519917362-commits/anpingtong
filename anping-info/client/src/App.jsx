import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Category from './pages/Category'
import PostDetail from './pages/PostDetail'
import PostCreate from './pages/PostCreate'
import Login from './pages/Login'
import Register from './pages/Register'
import MyPosts from './pages/MyPosts'
import Search from './pages/Search'
import ToolsHome from './pages/tools/ToolsHome'
import LogisticsTool from './pages/tools/LogisticsTool'
import WiremeshTool from './pages/tools/WiremeshTool'
import MaterialsTool from './pages/tools/MaterialsTool'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import Notices from './pages/Notices'
import NoticeDetail from './pages/NoticeDetail'
import StaticPage from './pages/StaticPage'
import AllCategories from './pages/AllCategories'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="all-categories" element={<AllCategories />} />
            <Route path="category/:slug" element={<Category />} />
            <Route path="post/:id" element={<PostDetail />} />
            <Route path="post-create" element={<PostCreate />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="my-posts" element={<MyPosts />} />
            <Route path="search" element={<Search />} />
            <Route path="tools" element={<ToolsHome />} />
            <Route path="tools/logistics" element={<LogisticsTool />} />
            <Route path="tools/wiremesh" element={<WiremeshTool />} />
            <Route path="tools/materials" element={<MaterialsTool />} />
            {/* 招聘专区 */}
            <Route path="jobs" element={<Jobs />} />
            <Route path="job/:id" element={<JobDetail />} />
            {/* 企业黄页 */}
            <Route path="companies" element={<Companies />} />
            <Route path="company/:id" element={<CompanyDetail />} />
            {/* 公告系统 */}
            <Route path="notices" element={<Notices />} />
            <Route path="notice/:id" element={<NoticeDetail />} />
            {/* 静态页面 */}
            <Route path="page/:slug" element={<StaticPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
