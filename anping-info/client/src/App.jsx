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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
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
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
