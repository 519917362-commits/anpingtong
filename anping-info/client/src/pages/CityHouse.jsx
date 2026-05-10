import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const PROPERTY_TYPES = [
  { id: 'all', name: '全部', icon: '🏠' },
  { id: 'factory-rent', name: '厂房出租', icon: '🏭' },
  { id: 'residence-sale', name: '住宅出售', icon: '🏡' },
  { id: 'residence-rent', name: '住宅出租', icon: '🔑' },
  { id: 'factory-want', name: '厂房求租', icon: '📋' },
  { id: 'land-sale', name: '土地转让', icon: '🌍' },
  { id: 'house-want', name: '求购住房', icon: '💡' },
  { id: 'shop-rent', name: '店铺出租', icon: '🏪' },
  { id: 'shop-transfer', name: '店铺转让', icon: '🔄' },
]

const AREAS = [
  { id: 'all', name: '全部区域' },
  { id: 'chengguan', name: '县城' },
  { id: 'gyyq', name: '工业园区' },
  { id: 'jjkfq', name: '经济开发区' },
  { id: 'sjs', name: '孙遥城' },
  { id: 'wx', name: '王胡林' },
  { id: 'dq', name: '东黄城' },
  { id: 'md', name: '马店' },
  { id: 'nw', name: '南王庄' },
]

const PRICE_RANGES = [
  { id: 'all', name: '不限' },
  { id: '0-1000', name: '1000元以下' },
  { id: '1000-2000', name: '1000-2000' },
  { id: '2000-3000', name: '2000-3000' },
  { id: '3000-5000', name: '3000-5000' },
  { id: '5000-10000', name: '5000-10000' },
  { id: '10000+', name: '10000以上' },
]

const SORT_OPTIONS = [
  { id: 'default', name: '默认排序' },
  { id: 'price-asc', name: '价格从低到高' },
  { id: 'price-desc', name: '价格从高到低' },
  { id: 'time', name: '最新发布' },
]

function formatPrice(price, type = 'rent') {
  if (!price || price === 0) return '面议'
  if (type === 'rent' || type === 'shop-rent' || type === 'factory-rent') {
    return `${Number(price).toLocaleString()}/月`
  }
  return `¥${Number(price).toLocaleString()}`
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return dateStr.slice(0, 10)
}

export default function CityHouse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  const currentType = searchParams.get('type') || 'all'
  const currentArea = searchParams.get('area') || 'all'
  const currentPrice = searchParams.get('price') || 'all'
  const currentSort = searchParams.get('sort') || 'default'
  const keyword = searchParams.get('keyword') || ''

  const [searchKeyword, setSearchKeyword] = useState(keyword)

  useEffect(() => {
    fetchPosts()
  }, [currentType, currentArea, currentPrice, currentSort, keyword])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('pageSize', '100')
      
      if (keyword) {
        params.set('keyword', keyword)
      }
      
      const categories = ['house', 'shop-transfer']
      const promises = categories.map(cat => 
        fetch(`/api/posts?category=${cat}&${params.toString()}`).then(r => r.json())
      )
      
      const results = await Promise.all(promises)
      let allPosts = results.flatMap(r => r.code === 200 ? r.data.list : [])
      
      const propertyData = [
        // 厂房出租
        { id: 10001, title: '东寨子临街库房出租', location: '东寨子', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10002, title: '城西安华路西出租厂房200平米', location: '城西', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10003, title: '出租厂房2100平米带天车办公室宿舍', location: '安平县', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10004, title: '出租赵八庄工业区内新厂房6000平米', location: '赵八庄', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10005, title: '出租车间1300平独门独院', location: '西外环', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10006, title: '出租厂房1700平米新式厂房带办公楼', location: '安平县', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10007, title: '徐疃科发园区出租独门独院厂房3200平米', location: '徐疃', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10008, title: '南胡林村厂房出租500平水电齐全', location: '南胡林', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10009, title: '聚成物流东厂房出租6000平米新厂房', location: '聚成物流', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10010, title: '低价出租标准新厂房2000-7000平米', location: '安平县', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10011, title: '汽车站附近出租厂房带天车办公室宿舍', location: '汽车站', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10012, title: '徐疃喷塑厂房出租1000平米环评齐全', location: '徐疃', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10013, title: '出租厂房4600平可分租可整租', location: '安平县', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10014, title: '耿屯附近出租厂房1350平米带天车办公室', location: '耿屯', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10015, title: '台城村北工业厂房1000平米独门独院', location: '台城', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10016, title: '南外环2200平米厂房+400平米办公楼出租', location: '南外环', price: 0, category_slug: 'house', category_name: '厂房出租', created_at: '2026-05-10' },
        { id: 10017, title: '出租铺垫好的场地4000平', location: '安平县', price: 0, category_slug: 'house', category_name: '场地出租', created_at: '2026-05-10' },
        // 住宅楼出售
        { id: 20001, title: '出售安平县裕华路国盛小区单元住宅楼', location: '裕华路', price: 0, category_slug: 'house', category_name: '住宅出售', created_at: '2026-05-09' },
        { id: 20002, title: '出售华坐西步梯三楼顶层三室两厅', location: '华坐西', price: 0, category_slug: 'house', category_name: '住宅出售', created_at: '2026-05-09' },
        { id: 20003, title: '出售凯旋城一期住房134平', location: '凯旋城', price: 0, category_slug: 'house', category_name: '住宅出售', created_at: '2026-05-08' },
        { id: 20004, title: '金地格林房屋出售99.99平', location: '金地格林', price: 0, category_slug: 'house', category_name: '住宅出售', created_at: '2026-05-09' },
        { id: 20005, title: '出售鑫苑小区148平', location: '鑫苑小区', price: 0, category_slug: 'house', category_name: '住宅出售', created_at: '2026-05-09' },
        { id: 20006, title: '出售宏业小区步梯顶楼110平', location: '宏业小区', price: 0, category_slug: 'house', category_name: '住宅出售', created_at: '2026-05-08' },
        { id: 20007, title: '出售隆庆小区住宅楼120平', location: '隆庆小区', price: 0, category_slug: 'house', category_name: '住宅出售', created_at: '2026-05-08' },
        { id: 20008, title: '金色阳光135平带车库76万', location: '金色阳光', price: 760000, category_slug: 'house', category_name: '住宅出售', created_at: '2026-05-08' },
        { id: 20009, title: '峰尚141平精装带车位75万', location: '峰尚', price: 750000, category_slug: 'house', category_name: '住宅出售', created_at: '2026-05-08' },
        { id: 20010, title: '金穗108平小三室60万', location: '金穗', price: 600000, category_slug: 'house', category_name: '住宅出售', created_at: '2026-05-08' },
        // 住宅楼出租
        { id: 30001, title: '出租南环启蒙学校附近单间一个月700', location: '南环', price: 700, category_slug: 'house', category_name: '住宅出租', created_at: '2026-05-10' },
        { id: 30002, title: '出租一小附近单间一年6500', location: '一小', price: 6500, category_slug: 'house', category_name: '住宅出租', created_at: '2026-05-10' },
        { id: 30003, title: '出租城东王各庄社区楼房两室一厅90平', location: '城东', price: 0, category_slug: 'house', category_name: '住宅出租', created_at: '2026-05-06' },
        { id: 30004, title: '旧电力局家属院二楼二室一厅80平', location: '旧电力局', price: 0, category_slug: 'house', category_name: '住宅出租', created_at: '2026-05-01' },
        { id: 30005, title: '鑫旺小区二楼130平米', location: '鑫旺小区', price: 0, category_slug: 'house', category_name: '住宅出租', created_at: '2026-05-01' },
        { id: 30006, title: '平安公园附近楼房三室一厅家具家电齐全', location: '平安公园', price: 0, category_slug: 'house', category_name: '住宅出租', created_at: '2026-05-01' },
        { id: 30007, title: '锦绣花城楼房出租40平', location: '锦绣花城', price: 0, category_slug: 'house', category_name: '住宅出租', created_at: '2026-05-10' },
        { id: 30008, title: '汽车站西单间出租', location: '汽车站', price: 0, category_slug: 'house', category_name: '住宅出租', created_at: '2026-05-10' },
        { id: 30009, title: '中心路月租房单间出租', location: '中心路', price: 0, category_slug: 'house', category_name: '住宅出租', created_at: '2026-05-10' },
        { id: 30010, title: '住宅楼出租120平', location: '安平县', price: 0, category_slug: 'house', category_name: '住宅出租', created_at: '2026-05-10' },
        // 厂房求租
        { id: 40001, title: '诚租1200平左右厂房', location: '安平县', price: 0, category_slug: 'house', category_name: '厂房求租', created_at: '2026-05-09' },
        { id: 40002, title: '求租900-1000平城西厂房', location: '城西', price: 0, category_slug: 'house', category_name: '厂房求租', created_at: '2026-05-05' },
        { id: 40003, title: '求租900-1000平独门独院', location: '安平县', price: 0, category_slug: 'house', category_name: '厂房求租', created_at: '2026-05-05' },
        { id: 40004, title: '求租厂房350-400平带小院', location: '安平县', price: 0, category_slug: 'house', category_name: '厂房求租', created_at: '2026-04-21' },
        // 土地出售 fid=15
        { id: 50001, title: '滤材城附近土地出售两亩', location: '滤材城', price: 0, category_slug: 'house', category_name: '土地出售', created_at: '2026-05-09' },
        { id: 50002, title: '安平北外环新征土地出售6亩', location: '北外环', price: 0, category_slug: 'house', category_name: '土地出售', created_at: '2026-05-09' },
        { id: 50003, title: '北外环附近土地14亩出售', location: '北外环', price: 0, category_slug: 'house', category_name: '土地出售', created_at: '2026-05-08' },
        { id: 50004, title: '饶阳工业园区厂房带土地8亩', location: '饶阳', price: 0, category_slug: 'house', category_name: '土地出售', created_at: '2026-05-08' },
        { id: 50005, title: '南外环附近土地1300平', location: '南外环', price: 0, category_slug: 'house', category_name: '土地出售', created_at: '2026-05-08' },
        { id: 50006, title: '北外环路东土地九亩有手续', location: '北外环', price: 0, category_slug: 'house', category_name: '土地出售', created_at: '2026-05-07' },
        { id: 50007, title: '东外环600平场地出租', location: '东外环', price: 0, category_slug: 'house', category_name: '场地出租', created_at: '2026-05-07' },
        { id: 50008, title: '聚成物流附近场地出租2000平', location: '聚成物流', price: 0, category_slug: 'house', category_name: '场地出租', created_at: '2026-05-07' },
        { id: 50009, title: '郭西工业用地转让', location: '郭西', price: 0, category_slug: 'house', category_name: '土地转让', created_at: '2026-05-06' },
        { id: 50010, title: '土地出售3000平价格便宜', location: '安平县', price: 0, category_slug: 'house', category_name: '土地出售', created_at: '2026-05-06' },
        // 二手房求购 fid=16
        { id: 60001, title: '求购一套80平左右住房', location: '安平县', price: 0, category_slug: 'house', category_name: '求购住房', created_at: '2026-05-09' },
        { id: 60002, title: '求购一套100平左右电梯房两居室', location: '安平县', price: 0, category_slug: 'house', category_name: '求购住房', created_at: '2026-05-09' },
        { id: 60003, title: '求购上东一号小区四室住房', location: '上东一号', price: 0, category_slug: 'house', category_name: '求购住房', created_at: '2026-05-08' },
        { id: 60004, title: '求购三居室要求有证可贷款', location: '安平县', price: 0, category_slug: 'house', category_name: '求购住房', created_at: '2026-05-08' },
        { id: 60005, title: '求购三室或四室100-130平', location: '安平县', price: 0, category_slug: 'house', category_name: '求购住房', created_at: '2026-05-07' },
        { id: 60006, title: '诚心求购三室步梯2-3楼', location: '安平县', price: 0, category_slug: 'house', category_name: '求购住房', created_at: '2026-05-07' },
        { id: 60007, title: '全款求购100平左右两居室', location: '安平县', price: 0, category_slug: 'house', category_name: '求购住房', created_at: '2026-05-06' },
        { id: 60008, title: '求购金色阳光三室或四室', location: '金色阳光', price: 0, category_slug: 'house', category_name: '求购住房', created_at: '2026-05-06' },
        { id: 60009, title: '求购150平左右大户型', location: '安平县', price: 0, category_slug: 'house', category_name: '求购住房', created_at: '2026-05-05' },
        { id: 60010, title: '求购90-120平电梯房可全款', location: '安平县', price: 0, category_slug: 'house', category_name: '求购住房', created_at: '2026-05-05' },
        // 门店出租/转让 fid=17
        { id: 70001, title: '转让红旗街女装店130平', location: '红旗街', price: 0, category_slug: 'shop-transfer', category_name: '店铺转让', created_at: '2026-05-10' },
        { id: 70002, title: '临街平房店铺出租', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-10' },
        { id: 70003, title: '门店出租出售210平上下两层', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-10' },
        { id: 70004, title: '北外环门店出租120平', location: '北外环', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-10' },
        { id: 70005, title: '安平县北外环独栋门店出售', location: '北外环', price: 0, category_slug: 'shop-transfer', category_name: '店铺出售', created_at: '2026-05-10' },
        { id: 70006, title: '中心路南段店铺转让', location: '中心路', price: 0, category_slug: 'shop-transfer', category_name: '店铺转让', created_at: '2026-05-09' },
        { id: 70007, title: '东外环门店出租80平', location: '东外环', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-09' },
        { id: 70008, title: '西外环门店出租120平', location: '西外环', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-09' },
        { id: 70009, title: '新盈街西段门店出租', location: '新盈街', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-09' },
        { id: 70010, title: '门店出租50平适合各种行业', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-09' },
        { id: 70011, title: '饭店转让138平带设备', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-09' },
        { id: 70012, title: '丝网产业带商铺出售', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '店铺出售', created_at: '2026-05-09' },
        { id: 70013, title: '足疗店转让180平', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-08' },
        { id: 70014, title: '洗车店低价转让', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-08' },
        { id: 70015, title: '南外环门脸房出租110平', location: '南外环', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-08' },
        { id: 70016, title: '裕华路门店转让70平', location: '裕华路', price: 0, category_slug: 'shop-transfer', category_name: '店铺转让', created_at: '2026-05-08' },
        { id: 70017, title: '转让正在营业中台球厅', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-07' },
        { id: 70018, title: '安平镇土地及门店出售', location: '安平镇', price: 0, category_slug: 'shop-transfer', category_name: '店铺出售', created_at: '2026-05-07' },
        { id: 70019, title: '台城附近洗车店转让', location: '台城', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-07' },
        { id: 70020, title: '汉堡店带技术转让', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-07' },
        { id: 70021, title: '南胡林村口门店出租80平', location: '南胡林', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-06' },
        { id: 70022, title: '火锅店转让260平上下两层', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-06' },
        { id: 70023, title: '转让营业中水果店', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-06' },
        { id: 70024, title: '营业中文具店转让', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-06' },
        { id: 70025, title: '转让南王宋学校旁门店', location: '南王宋', price: 0, category_slug: 'shop-transfer', category_name: '店铺转让', created_at: '2026-05-05' },
        { id: 70026, title: '中心路门店出租60平', location: '中心路', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-05' },
        { id: 70027, title: '安平县KTV转让', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-05' },
        { id: 70028, title: '转让营业中文具店60平', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-05' },
        { id: 70029, title: '南外环路门店出租上下三层', location: '南外环', price: 0, category_slug: 'shop-transfer', category_name: '店铺出租', created_at: '2026-05-04' },
        { id: 70030, title: '转让营业中快递驿站', location: '安平县', price: 0, category_slug: 'shop-transfer', category_name: '生意转让', created_at: '2026-05-04' },
        { id: 70031, title: '南关大街门店转让上下两层', location: '南关大街', price: 0, category_slug: 'shop-transfer', category_name: '店铺转让', created_at: '2026-05-04' },
      ]
      
      allPosts = [...allPosts, ...propertyData]
      
      if (currentType !== 'all') {
        allPosts = allPosts.filter(post => {
          const categoryName = (post.category_name || '').toLowerCase()
          switch(currentType) {
            case 'factory-rent': return categoryName.includes('厂房出租') || categoryName.includes('场地出租')
            case 'residence-sale': return categoryName.includes('住宅出售')
            case 'residence-rent': return categoryName.includes('住宅出租')
            case 'factory-want': return categoryName.includes('厂房求租')
            case 'land-sale': return categoryName.includes('土地出售') || categoryName.includes('土地转让')
            case 'house-want': return categoryName.includes('求购住房')
            case 'shop-rent': return categoryName.includes('店铺出租') || categoryName.includes('门店出租')
            case 'shop-transfer': return categoryName.includes('店铺转让') || categoryName.includes('店铺出售') || categoryName.includes('生意转让')
            default: return true
          }
        })
      }
      
      if (currentArea !== 'all') {
        const areaNames = {
          'chengguan': ['县城', '中心', '城里'],
          'gyyq': ['园区', '工业园'],
          'jjkfq': ['开发区', '经济'],
          'sjs': ['孙遥', '孙姚'],
          'wx': ['王胡', '王护'],
          'dq': ['东黄'],
          'md': ['马店'],
          'nw': ['南王'],
        }
        const searchTerms = areaNames[currentArea] || []
        if (searchTerms.length > 0) {
          allPosts = allPosts.filter(post => {
            const location = ((post.location || '') + (post.title || '')).toLowerCase()
            return searchTerms.some(term => location.includes(term.toLowerCase()))
          })
        }
      }
      
      if (currentPrice !== 'all') {
        const [min, max] = currentPrice.split('-').map(v => v === '+' ? Infinity : Number(v))
        if (currentPrice === '10000+') {
          allPosts = allPosts.filter(p => p.price >= 10000)
        } else {
          allPosts = allPosts.filter(p => p.price >= min && p.price <= max)
        }
      }
      
      switch(currentSort) {
        case 'price-asc': allPosts.sort((a, b) => (a.price || 0) - (b.price || 0)); break
        case 'price-desc': allPosts.sort((a, b) => (b.price || 0) - (a.price || 0)); break
        case 'time': allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break
        default: allPosts.sort((a, b) => b.id - a.id)
      }
      
      setPosts(allPosts)
    } catch (err) {
      console.error('获取数据失败:', err)
    }
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchKeyword.trim()) {
      setSearchParams(prev => {
        prev.set('keyword', searchKeyword.trim())
        return prev
      })
    }
  }

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      if (value === 'all') {
        prev.delete(key)
      } else {
        prev.set(key, value)
      }
      return prev
    })
  }

  const clearFilters = () => {
    setSearchParams({})
    setSearchKeyword('')
  }

  const getPropertyType = (post) => {
    return post.category_name || '房产'
  }

  const getPropertyTypeColor = (type) => {
    const colors = {
      '厂房出租': 'bg-orange-100 text-orange-600',
      '场地出租': 'bg-orange-100 text-orange-600',
      '住宅出售': 'bg-green-100 text-green-600',
      '住宅出租': 'bg-blue-100 text-blue-600',
      '厂房求租': 'bg-amber-100 text-amber-600',
      '土地出售': 'bg-lime-100 text-lime-600',
      '土地转让': 'bg-lime-100 text-lime-600',
      '求购住房': 'bg-purple-100 text-purple-600',
      '店铺出租': 'bg-pink-100 text-pink-600',
      '门店出租': 'bg-pink-100 text-pink-600',
      '店铺转让': 'bg-rose-100 text-rose-600',
      '店铺出售': 'bg-rose-100 text-rose-600',
      '生意转让': 'bg-indigo-100 text-indigo-600',
    }
    return colors[type] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="space-y-4">
      {/* 顶部搜索 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 shadow-sm text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h1 className="text-xl font-bold">同城房产</h1>
            <p className="text-xs opacity-80">安平县房产信息平台</p>
          </div>
        </div>
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="搜索房产信息..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-orange-500 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition text-sm"
            >
              搜索
            </button>
          </div>
        </form>
      </div>

      {/* 分类导航 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {PROPERTY_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => updateFilter('type', type.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition text-sm ${
                currentType === type.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{type.icon}</span>
              <span className="font-medium">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">筛选:</span>
            {(currentPrice !== 'all' || currentArea !== 'all' || currentSort !== 'default' || currentType !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:underline"
              >
                清除
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs text-orange-500 flex items-center gap-1"
          >
            <span>{showFilters ? '收起' : '更多'}</span>
            <span>{showFilters ? '▲' : '▼'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2 overflow-x-auto">
          <span className="text-gray-400 text-xs shrink-0">区域:</span>
          {AREAS.map(area => (
            <button
              key={area.id}
              onClick={() => updateFilter('area', area.id)}
              className={`px-2 py-1 rounded text-xs whitespace-nowrap transition ${
                currentArea === area.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>

        {showFilters && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-xs w-8 shrink-0">价格:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRICE_RANGES.map(range => (
                  <button
                    key={range.id}
                    onClick={() => updateFilter('price', range.id)}
                    className={`px-2 py-1 rounded text-xs transition ${
                      currentPrice === range.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs w-8 shrink-0">排序:</span>
              <div className="flex gap-1.5">
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => updateFilter('sort', option.id)}
                    className={`px-2 py-1 rounded text-xs transition ${
                      currentSort === option.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 结果统计 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          共 <span className="text-orange-500 font-medium">{posts.length}</span> 条
        </div>
        <Link
          to="/post-create"
          className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition"
        >
          发布信息
        </Link>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-gray-400">加载中...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🏠</div>
          <p className="text-gray-400 mb-4">暂无符合条件的房产信息</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="flex gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition last:border-b-0"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl shrink-0">
                🏠
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 flex-1">
                    {post.title}
                  </h3>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getPropertyTypeColor(getPropertyType(post))}`}>
                    {getPropertyType(post)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{post.location || '安平县'}</p>
                <div className="flex items-center justify-between">
                  <div className="text-red-500 font-bold text-sm">
                    {formatPrice(post.price, post.category_name?.includes('出租') || post.category_name?.includes('租') ? 'rent' : 'sale')}
                  </div>
                  <div className="text-xs text-gray-400">{timeAgo(post.created_at)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}