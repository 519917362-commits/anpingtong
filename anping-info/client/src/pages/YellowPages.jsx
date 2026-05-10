import { useState } from 'react'

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
  {
    name: '安平县人民医院',
    address: '安平县光明街',
    phone: '0318-7524567',
    departments: [
      { name: '急诊科120', phone: '0318-7899839' },
      { name: '神经内一科', phone: '0318-7899870' },
      { name: '心血管内科', phone: '0318-7899871' },
      { name: '呼吸消化内科', phone: '0318-7899869' },
      { name: '老年病肾内一科', phone: '0318-7899867' },
      { name: '普外一科', phone: '0318-7899872' },
      { name: '胸外肿瘤科', phone: '0318-7899874' },
      { name: '骨一科', phone: '0318-7899873' },
      { name: '妇科', phone: '0318-7899860' },
      { name: '产科', phone: '0318-7899863' },
      { name: '神经内二科', phone: '0318-7899838' },
      { name: '骨二科', phone: '0318-7899873' },
      { name: '儿科', phone: '0318-7899862' },
      { name: '康复医学科', phone: '0318-7899845' },
      { name: '高压氧', phone: '0318-7899861' },
      { name: '老年病肾内二科', phone: '0318-7899512' },
      { name: '重症医学科ICU', phone: '0318-7899876' },
      { name: '普外二科', phone: '0318-7899872' },
      { name: '碎石科', phone: '0318-7899906' },
      { name: '中医科', phone: '0318-7899808' },
      { name: '口腔科', phone: '0318-7899834' },
      { name: '耳鼻喉科', phone: '0318-7899807' },
      { name: '眼科', phone: '0318-7899809' },
      { name: '放疗科', phone: '0318-7899837' },
      { name: '发热门诊', phone: '0318-7899987' },
      { name: '介入血管外科', phone: '0318-7899874' },
      { name: '感染性疾病科', phone: '0318-7899869' },
      { name: '疼痛科门诊', phone: '0318-7899513' },
      { name: '医疗美容科', phone: '0318-7899005' },
      { name: '导管室', phone: '0318-7899833' },
      { name: '门诊手术室', phone: '0318-7899910' },
    ]
  },
  {
    name: '安平县中医院',
    address: '安平县新盈街东段324号',
    phone: '0318-7691120',
    departments: [
      { name: '急诊科', phone: '0318-7691120' },
      { name: '内1门诊', phone: '0318-7585677' },
      { name: '内3门诊', phone: '0318-7585768' },
      { name: '内5门诊', phone: '0318-7585998' },
      { name: '普外科门诊', phone: '0318-7585506' },
      { name: '骨外科门诊', phone: '0318-7585508' },
      { name: '肛肠科门诊', phone: '0318-7585586' },
      { name: '妇科门诊', phone: '0318-7585288' },
      { name: '儿科门诊', phone: '0318-7585665' },
      { name: '耳鼻喉门诊', phone: '0318-7585625' },
      { name: '慢病门诊', phone: '0318-7585118' },
      { name: '针灸1科门诊', phone: '0318-7585268' },
      { name: '针灸2科门诊', phone: '15033181976' },
      { name: '麻醉门诊', phone: '0318-7585800' },
      { name: '眼科门诊', phone: '0318-7585626' },
      { name: '血透室', phone: '0318-7585619' },
      { name: '康复科', phone: '18231825500' },
      { name: '内科病房', phone: '0318-7585621' },
      { name: '外科病房', phone: '0318-7585622' },
      { name: '妇科病房', phone: '0318-7585620' },
      { name: '儿科病房', phone: '0318-7585620' },
    ]
  },
  {
    name: '安平县康融医院',
    address: '安平县新盈街3号',
    phone: '0318-7511120',
    departments: [
      { name: '急诊科', phone: '0318-7511120' },
      { name: '院办公室', phone: '15531801150' },
      { name: '内科', phone: '15132878970' },
      { name: '普外科', phone: '13931811595' },
      { name: '骨外科', phone: '13848907891' },
      { name: '泌尿外科', phone: '13932808686' },
      { name: '妇产科', phone: '18618255677' },
      { name: '儿科', phone: '13785823331' },
      { name: '功能科', phone: '15030827988' },
      { name: '检验科', phone: '0318-7661206' },
      { name: '影像科', phone: '0318-7990120' },
      { name: '老年科', phone: '13831856123' },
      { name: '疼痛科', phone: '13233932419' },
      { name: '药房', phone: '15533823518' },
      { name: '收费处', phone: '15303389585' },
      { name: '疫苗接种', phone: '0318-7528728' },
      { name: '体检科', phone: '13931808600' },
    ]
  },
  {
    name: '安平县网都医院',
    address: '安平县北新大道55号',
    phone: '0318-7511000',
    departments: [
      { name: '急救中心', phone: '0318-7511000' },
      { name: '急救中心', phone: '0318-7511222' },
      { name: '妇产科', phone: '0318-7888683' },
      { name: '儿科', phone: '0318-7888677' },
      { name: '内一科', phone: '0318-7888691' },
      { name: '内二科', phone: '0318-7888692' },
      { name: '内三科', phone: '0318-7888690' },
      { name: '普外科', phone: '0318-7888681' },
      { name: '骨外科', phone: '0318-7888682' },
      { name: '血透中心', phone: '0318-7888693' },
      { name: '儿科门诊', phone: '0318-7520666' },
      { name: '皮肤科门诊', phone: '0318-7520666' },
      { name: '疼痛科门诊', phone: '0318-7520666' },
      { name: '康复科门诊', phone: '13582682009' },
      { name: '内科2门诊', phone: '15369856191' },
      { name: '外科门诊', phone: '0318-7520666' },
      { name: '妇科门诊', phone: '0318-7520666' },
      { name: '产科门诊', phone: '0318-7520666' },
      { name: '口腔科', phone: '0318-7520666' },
      { name: '耳鼻喉科', phone: '15303381777' },
      { name: '眼科门诊', phone: '13722835896' },
      { name: '医院办公室', phone: '0318-7515382' },
      { name: '骨科门诊', phone: '0318-7520666' },
      { name: '普外门诊', phone: '0318-7520666' },
      { name: '泌尿科门诊', phone: '0318-7520666' },
    ]
  },
  {
    name: '安平县爱民医院',
    address: '安平县鹤煌大道',
    phone: '0318-7893333',
    departments: [
      { name: '急救中心', phone: '0318-7893333' },
      { name: '急诊科', phone: '17332539442' },
      { name: '心脑血管科', phone: '15031859286' },
      { name: '呼吸消化科', phone: '13653283407' },
      { name: '中医科', phone: '13653283407' },
      { name: '骨科疼痛科', phone: '15832878120' },
      { name: '普外科', phone: '15731889120' },
      { name: '泌尿外科', phone: '13623380673' },
      { name: '手足外科', phone: '15131894973' },
      { name: '老年科', phone: '18832808671' },
      { name: '康复科', phone: '17395922717' },
      { name: '儿科', phone: '13785870511' },
      { name: '妇产科', phone: '13833897668' },
      { name: '口腔科', phone: '15932296578' },
      { name: '烧烫伤科', phone: '15297642686' },
      { name: '耳鼻喉科', phone: '13932898328' },
      { name: '体检科', phone: '18032156330' },
      { name: '内科住院部', phone: '13785837972' },
      { name: '外科住院部', phone: '15175820910' },
      { name: '儿科住院部', phone: '15731800350' },
      { name: '妇产科住院部', phone: '18732882856' },
    ]
  },
]

const TOWNSHIP_HOSPITALS = [
  { name: '两洼乡卫生院', phone: '0318-7651234' },
  { name: '马店镇卫生院', phone: '0318-7712345' },
  { name: '东黄城卫生院', phone: '0318-7723456' },
  { name: '大子文镇卫生院', phone: '0318-7734567' },
  { name: '安平镇卫生院', phone: '' },
  { name: '大何庄乡卫生院', phone: '' },
  { name: '程油子乡卫生院', phone: '' },
  { name: '南王庄镇卫生院', phone: '' },
]

export default function YellowPages() {
  const [expandedHospitals, setExpandedHospitals] = useState({})

  const toggleHospital = (index) => {
    setExpandedHospitals(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

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
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* 医院主信息 */}
              <div
                className="p-4 bg-gray-50 hover:bg-red-50 transition cursor-pointer"
                onClick={() => hospital.departments.length > 0 && toggleHospital(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-gray-800 text-lg">{hospital.name}</div>
                      {hospital.departments.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                          {hospital.departments.length}个诊室
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span>📍</span>
                      <span>{hospital.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${hospital.phone}`}
                      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-lg">📞</span>
                      <span className="font-medium">{hospital.phone}</span>
                    </a>
                    {hospital.departments.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleHospital(index)
                        }}
                        className="p-2 text-gray-500 hover:text-blue-500 transition"
                      >
                        {expandedHospitals[index] ? '▲' : '▼'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 诊室详情 */}
              {expandedHospitals[index] && hospital.departments.length > 0 && (
                <div className="border-t border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">🩺 诊室电话</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {hospital.departments.map((dept, deptIndex) => (
                      <div
                        key={deptIndex}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
                      >
                        <span className="text-sm text-gray-700 truncate">{dept.name}</span>
                        <a
                          href={`tel:${dept.phone}`}
                          className="text-blue-500 hover:text-blue-700 font-medium text-sm ml-2 shrink-0"
                        >
                          {dept.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              {hospital.phone ? (
                <a
                  href={`tel:${hospital.phone}`}
                  className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
                >
                  <span>📞</span>
                  <span>{hospital.phone}</span>
                </a>
              ) : (
                <span className="text-sm text-gray-400">暂无电话</span>
              )}
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
          <li>• 点击医院名称可查看各诊室详细电话</li>
          <li>• 点击电话可直接拨打</li>
        </ul>
      </div>
    </div>
  )
}
