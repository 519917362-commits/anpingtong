import { Link } from 'react-router-dom'

const POWER_STATIONS = [
  { name: '安北供电所', phone: '0318-7503070' },
  { name: '南王庄供电所', phone: '0318-7626135' },
  { name: '子文供电所', phone: '0318-7632835' },
  { name: '何庄供电所', phone: '0318-7723244' },
  { name: '油子供电所', phone: '0318-7826043' },
  { name: '苏村供电所', phone: '0318-7716621' },
  { name: '高新区供电所', phone: '0318-7812747' },
  { name: '两洼供电所', phone: '0318-7657616' },
]

const HOSPITALS = [
  { name: '安平县人民医院', address: '安平县光明街', phone: '0318-7524567' },
  { name: '安平县中医院', address: '安平县新盈街东段324号', phone: '0318-7524568' },
  { name: '安平县康融医院', address: '安平县新盈街3号', phone: '0318-7524569' },
  { name: '安平县网都医院', address: '安平县北新大道55号', phone: '0318-7524570' },
  { name: '安平县爱民医院', address: '安平县鹤煌大道', phone: '0318-7524571' },
]

const TOWNSHIP_HOSPITALS = [
  { name: '两洼乡卫生院', phone: '0318-7651234' },
  { name: '马店镇卫生院', phone: '0318-7712345' },
  { name: '东黄城卫生院', phone: '0318-7723456' },
  { name: '大子文镇卫生院', phone: '0318-7734567' },
]

export default function YellowPages() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">📖 安平黄页</h1>
        <p className="opacity-90">安平县便民服务电话簿</p>
      </div>

      {/* 供电所 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span>县城供电所电话</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {POWER_STATIONS.map((station, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition group"
            >
              <div>
                <div className="font-medium text-gray-800">{station.name}</div>
                <div className="text-sm text-gray-500 mt-1">24小时供电服务</div>
              </div>
              <a
                href={`tel:${station.phone}`}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <span className="text-lg">📞</span>
                <span className="font-medium">{station.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 县城医院 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span>县城医院电话</span>
        </h2>
        <div className="space-y-3">
          {HOSPITALS.map((hospital, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-lg">{hospital.name}</div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span>📍</span>
                    <span>{hospital.address}</span>
                  </div>
                </div>
                <a
                  href={`tel:${hospital.phone}`}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shrink-0"
                >
                  <span className="text-lg">📞</span>
                  <span className="font-medium">{hospital.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 乡镇卫生院 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span>乡镇卫生院电话</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOWNSHIP_HOSPITALS.map((hospital, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-xl text-center hover:bg-green-50 transition"
            >
              <div className="font-medium text-gray-700 mb-2">{hospital.name}</div>
              <a
                href={`tel:${hospital.phone}`}
                className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
              >
                <span>📞</span>
                <span>{hospital.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 温馨提示 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="font-bold text-amber-800 mb-2">💡 温馨提示</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• 如遇供电故障，请拨打当地供电所电话报修</li>
          <li>• 紧急医疗情况请直接拨打120急救电话</li>
          <li>• 卫生院主要为周边村民提供基础医疗服务</li>
          <li>• 如需转院治疗，请咨询县级医院医生建议</li>
        </ul>
      </div>
    </div>
  )
}
