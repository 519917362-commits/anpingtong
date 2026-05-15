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
  {
    name: '两洼乡卫生院',
    phone: '',
    clinics: [
      { name: '两洼乡卫生院内科', phone: '13171715127' },
      { name: '两洼乡卫生院外科', phone: '13171715127' },
      { name: '两洼乡卫生院儿科', phone: '13931817952' },
      { name: '两洼乡卫生院妇科', phone: '13171715127' },
      { name: '两洼乡卫生院中医科', phone: '13303385567' },
      { name: '向屯村卫生室', phone: '13932876659' },
      { name: '耿屯村卫生室', phone: '18730884159' },
      { name: '西里屯村卫生室', phone: '15130840116' },
      { name: '东里屯村卫生室', phone: '13731362407' },
      { name: '小辛庄村卫生室', phone: '15333188558' },
      { name: '郑庄村卫生室', phone: '13131885554' },
      { name: '前埔村卫生室', phone: '13932879670' },
      { name: '后埔村卫生室', phone: '15732888819' },
      { name: '东毛庄村卫生室', phone: '13932806365' },
      { name: '西毛庄村卫生室', phone: '13663282806' },
      { name: '东程干村卫生室', phone: '13582480684' },
      { name: '西两洼村卫生室', phone: '13171715879' },
      { name: '东两洼村卫生室', phone: '13303385567' },
      { name: '南两洼村卫生室', phone: '13231857130' },
      { name: '东寨子村卫生室', phone: '15531848873' },
      { name: '东庙头村卫生室', phone: '13513185868' },
      { name: '西寨子村卫生室', phone: '13171717208' },
      { name: '史观屯村卫生室', phone: '13731362407' },
    ]
  },
  {
    name: '马店镇卫生院',
    phone: '',
    clinics: [
      { name: '马店镇卫生院内科', phone: '15933856689' },
      { name: '马店镇卫生院外科', phone: '15333183525' },
      { name: '马店镇卫生院儿科', phone: '15933801528' },
      { name: '马店镇卫生院妇科', phone: '15132894879' },
      { name: '马店镇卫生院中医科', phone: '15132866875' },
      { name: '周村卫生室', phone: '13784861978' },
      { name: '赵院村卫生室', phone: '15831808539' },
      { name: '香管村卫生室', phone: '13932875353' },
      { name: '许庄村卫生室', phone: '13831883892' },
      { name: '北郭村卫生室', phone: '15832836575' },
      { name: '马店村卫生室', phone: '13831876995' },
      { name: '马庄村卫生室', phone: '15930878808' },
      { name: '什伍村卫生室', phone: '15832830304' },
      { name: '柏林村卫生室', phone: '13785823519' },
      { name: '刘口屯村卫生室', phone: '13103187285' },
      { name: '院西村卫生室', phone: '13833813133' },
      { name: '邓庄村卫生室', phone: '13131813546' },
      { name: '北辛营村卫生室', phone: '13131806268' },
      { name: '刘吉口村卫生室', phone: '13103180908' },
      { name: '西长堤村卫生室', phone: '15931383176' },
      { name: '东长堤村卫生室', phone: '13931812034' },
      { name: '北满正村卫生室', phone: '13784861539' },
      { name: '朱庄村卫生室', phone: '13273302221' },
      { name: '徘徊村卫生室', phone: '15512991089' },
      { name: '王六市村卫生室', phone: '13292223595' },
      { name: '秦王庄村卫生室', phone: '13231806976' },
      { name: '北白沙庄村卫生室', phone: '13633280012' },
      { name: '南牛具村卫生室', phone: '13513085950' },
      { name: '南苏村卫生室', phone: '15130859692' },
      { name: '孝林村卫生室', phone: '13730236881' },
      { name: '辛店村卫生室', phone: '13784847967' },
      { name: '北苏村卫生室', phone: '13722818658' },
      { name: '南白沙庄村卫生室', phone: '13730533526' },
      { name: '付各庄村卫生室', phone: '13653287956' },
      { name: '曹庄村卫生室', phone: '13131822802' },
    ]
  },
  {
    name: '东黄城镇卫生院',
    phone: '',
    clinics: [
      { name: '东黄城村卫生室', phone: '13785821679' },
      { name: '北黄城村卫生室', phone: '13513083298' },
      { name: '东北黄城卫生室', phone: '15130850559' },
      { name: '东南黄城卫生室', phone: '13931834592' },
      { name: '徐疃村卫生室', phone: '18631830653' },
      { name: '唐贝村卫生室', phone: '13463849793' },
      { name: '西南黄城村卫生室', phone: '18333819182' },
      { name: '建张庄村卫生室', phone: '13482921547' },
      { name: '建赵庄村卫生室', phone: '13831854889' },
      { name: '徐张屯村卫生室', phone: '13722826977' },
      { name: '建王庄村卫生室', phone: '13730523092' },
      { name: '西里村卫生室', phone: '13833862010' },
      { name: '新民村卫生室', phone: '13363307727' },
      { name: '郭西村卫生室', phone: '13231815598' },
      { name: '台城村卫生室', phone: '15324188120' },
      { name: '南侯疃村卫生室', phone: '13932809789' },
      { name: '西侯疃村卫生室', phone: '15833185766' },
      { name: '北侯疃村卫生室', phone: '15833833739' },
      { name: '前大寨村卫生室', phone: '13932834577' },
      { name: '后大寨村卫生室', phone: '18731870964' },
      { name: '南庙头村卫生室', phone: '13582482536' },
      { name: '路庄村卫生室', phone: '13932833010' },
      { name: '敬思村卫生室', phone: '15533820172' },
      { name: '大同新村卫生室', phone: '13932833010' },
      { name: '东黄城镇卫生院全科', phone: '13663280386' },
      { name: '东黄城镇卫生院儿科', phone: '13831831292' },
      { name: '东黄城镇卫生院妇科', phone: '13831894326' },
      { name: '东黄城镇卫生院内科', phone: '13931837177' },
      { name: '东黄城镇卫生院外科', phone: '13932807322' },
    ]
  },
  {
    name: '大子文镇卫生院',
    phone: '',
    clinics: [
      { name: '北郝村卫生室', phone: '18831872535' },
      { name: '南郝村卫生室', phone: '13343183211' },
      { name: '崔安铺村卫生室', phone: '15175886756' },
      { name: '崔安村卫生室', phone: '18203381220' },
      { name: '马江村卫生室', phone: '15132829858' },
      { name: '石干村卫生室', phone: '13785892232' },
      { name: '邢郭庄村卫生室', phone: '13785846736' },
      { name: '张敖村卫生室', phone: '13831831259' },
      { name: '西赵庄村卫生室', phone: '13932893151' },
      { name: '张舍村卫生室', phone: '13932862916' },
      { name: '东白陀罗村卫生室', phone: '13785895848' },
      { name: '义里村卫生室', phone: '13932866567' },
      { name: '王营村卫生室', phone: '13785846423' },
      { name: '西白陀罗村卫生室', phone: '13633180815' },
      { name: '林庄村卫生室', phone: '13730529099' },
      { name: '孙辽城村卫生室', phone: '13932867870' },
      { name: '西辽城村卫生室', phone: '13831802143' },
      { name: '北王宋村卫生室', phone: '13643182940' },
      { name: '郭庄村卫生室', phone: '15633189397' },
      { name: '大子文村卫生室', phone: '13363332958' },
      { name: '南石庄村卫生室', phone: '15175845472' },
      { name: '店子头村卫生室', phone: '13931806269' },
      { name: '前子文村卫生室', phone: '18831822262' },
    ]
  },
  {
    name: '安平镇卫生院',
    phone: '',
    clinics: [
      { name: '安平镇卫生院妇科', phone: '15028816204' },
      { name: '安平镇卫生院内儿科', phone: '15028823067' },
      { name: '安平镇卫生院中医科', phone: '15531872671' },
      { name: '安平镇薛各庄村卫生室', phone: '13231896223' },
      { name: '安平镇前呈干村卫生室', phone: '13833847837' },
      { name: '安平镇刘疃村卫生室', phone: '13833862787' },
      { name: '安平镇李疃村卫生室', phone: '13785869724' },
      { name: '安平镇东会沃村卫生室', phone: '15369865157' },
      { name: '安平镇后呈干村卫生室', phone: '15030820638' },
      { name: '安平镇南胡林村卫生室', phone: '13931816953' },
      { name: '安平镇可胡林村卫生室', phone: '13833819036' },
      { name: '安平镇北张庄村卫生室', phone: '13292290197' },
      { name: '安平镇王各庄村卫生室', phone: '13633183201' },
      { name: '安平镇梅左村卫生室', phone: '13633187380' },
      { name: '安平镇王胡林村卫生室', phone: '15633541888' },
      { name: '安平镇前张庄村卫生室', phone: '15076852901' },
      { name: '安平镇杨马庄村卫生室', phone: '13932885223' },
      { name: '安平镇李各庄村卫生室', phone: '13785829186' },
      { name: '安平镇北张沃村卫生室', phone: '13383683071' },
      { name: '安平镇贾屯村卫生室', phone: '13833821547' },
      { name: '安平镇南张沃村卫生室', phone: '13171745058' },
      { name: '安平镇杨屯村卫生室', phone: '13722807602' },
      { name: '安平镇前刘营村卫生室', phone: '15633182903' },
      { name: '安平镇逯庄村卫生室', phone: '15175805105' },
      { name: '安平镇后刘营村卫生室', phone: '15203186066' },
      { name: '安平镇郭屯村卫生室', phone: '15369929669' },
      { name: '安平镇后张庄村卫生室', phone: '18731830322' },
      { name: '安平镇孝仁村卫生室', phone: '13703181831' },
      { name: '安平镇西王庄村卫生室', phone: '13132415959' },
      { name: '安平镇东关村卫生室', phone: '13785823776' },
      { name: '安平镇兴贤村卫生室', phone: '15030853228' },
      { name: '安平镇北关村卫生室', phone: '18832888588' },
      { name: '安平镇彭庄村卫生室', phone: '13400488870' },
      { name: '安平镇南关村卫生室', phone: '13231896223' },
      { name: '安平镇严疃村卫生室', phone: '15131852128' },
      { name: '安平镇宗庄村卫生室', phone: '13292290197' },
      { name: '安平镇政宣村卫生室', phone: '17181119888' },
      { name: '安平镇县前村卫生室', phone: '13081812367' },
      { name: '安平镇西关村卫生室', phone: '16631800687' },
      { name: '安平镇南大良村卫生室', phone: '15130837803' },
      { name: '安平镇北大良村卫生室', phone: '15633509088' },
      { name: '安平镇新政村卫生室', phone: '13932866687' },
      { name: '安平镇中大良村卫生室', phone: '15831809872' },
      { name: '安平镇西会沃村卫生室', phone: '13315821003' },
      { name: '安平镇西大良村卫生室', phone: '13613187444' },
      { name: '安平镇河漕村卫生室', phone: '18331820720' },
      { name: '安平镇东河桥村卫生室', phone: '13722812822' },
    ]
  },
  {
    name: '大何庄乡卫生院',
    phone: '',
    clinics: [
      { name: '大何庄乡卫生院内科', phone: '13785840559' },
      { name: '大何庄乡卫生院内儿科', phone: '13731359301' },
      { name: '大何庄乡卫生院妇科', phone: '13932887128' },
      { name: '大何庄乡卫生院中医科', phone: '15203188474' },
      { name: '大何庄乡卫生院中医二科', phone: '18731845396' },
      { name: '西李庄村卫生室', phone: '13303184235' },
      { name: '察罗村卫生室', phone: '15233290319' },
      { name: '郎仁屯村卫生室', phone: '13833861144' },
      { name: '马庄村卫生室', phone: '15931362530' },
      { name: '任庄村卫生室', phone: '15832846877' },
      { name: '中满子村卫生室', phone: '18617909162' },
      { name: '报子营村卫生室', phone: '15933815112' },
      { name: '彪塚村卫生室', phone: '13132421156' },
      { name: '大何庄村卫生室', phone: '15933182999' },
      { name: '东羽林村卫生室', phone: '13292206360' },
      { name: '西羽林村卫生室', phone: '15031813959' },
      { name: '长汝村卫生室', phone: '13191697836' },
      { name: '崔岭村卫生室', phone: '15297653188' },
      { name: '郎仁村卫生室', phone: '13623289678' },
      { name: '南满子村卫生室', phone: '15832866309' },
      { name: '北满子村卫生室', phone: '15832860099' },
      { name: '武崔庄村卫生室', phone: '13932899325' },
      { name: '彭营村卫生室', phone: '13785823065' },
      { name: '里河村卫生室', phone: '13833820684' },
      { name: '西满正村卫生室', phone: '15632856186' },
      { name: '马营村卫生室', phone: '15612821273' },
      { name: '马营村卫生室', phone: '13785867593' },
      { name: '杨各庄村卫生室', phone: '13613186570' },
      { name: '刘庄村卫生室', phone: '13231826489' },
      { name: '西何庄村卫生室', phone: '15031859772' },
    ]
  },
  {
    name: '程油子乡卫生院',
    phone: '',
    clinics: [
      { name: '程油子乡内科', phone: '13730523363' },
      { name: '程油子乡全科', phone: '13582480506' },
      { name: '信口村卫生室', phone: '15931379666' },
      { name: '刘门口村卫生室', phone: '13932811019' },
      { name: '大豆口村卫生室', phone: '13931806701' },
      { name: '东刘店村卫生室', phone: '15030852525' },
      { name: '南宅村卫生室', phone: '15132875887' },
      { name: '张店村卫生室', phone: '13253222289' },
      { name: '王油子村卫生室', phone: '13784860165' },
      { name: '邢庄村卫生室', phone: '13084544500' },
      { name: '高佐村', phone: '13084544500' },
      { name: '苏各庄', phone: '13084544500' },
      { name: '袁营村卫生室', phone: '13784173583' },
      { name: '张寨村卫生室', phone: '13932878305' },
      { name: '张宅村卫生室', phone: '13623381126' },
      { name: '张庄村卫生室', phone: '13831820656' },
      { name: '北牛具村卫生室', phone: '18231825500' },
      { name: '钦什村卫生室', phone: '13785868330' },
      { name: '寺店村卫生室', phone: '13831810362' },
      { name: '后刘兴庄村', phone: '18730893313' },
      { name: '武营村卫生室', phone: '13623381126' },
      { name: '中营村卫生室', phone: '13784173583' },
      { name: '崔各庄村卫生室', phone: '13784173583' },
      { name: '北里村村卫生室', phone: '15028778109' },
      { name: '北杨庄村卫生室', phone: '13582480665' },
      { name: '杨油子村卫生室', phone: '13131861260' },
      { name: '张营村卫生室', phone: '13785829765' },
      { name: '南两合村卫生室', phone: '13103381055' },
      { name: '南里村村卫生室', phone: '13131872866' },
      { name: '段佐村卫生室', phone: '13784836262' },
      { name: '中佐村卫生室', phone: '13403385105' },
      { name: '东石庄村卫生室', phone: '15533819823' },
      { name: '义门村卫生室', phone: '13785827036' },
      { name: '前刘兴庄村', phone: '13292238296' },
      { name: '周刘庄村卫生室', phone: '13345165160' },
      { name: '北油子村卫生室', phone: '13932878305' },
      { name: '东里村村卫生室', phone: '13180299813' },
      { name: '程油子村', phone: '13730523363' },
    ]
  },
  {
    name: '南王庄镇中心卫生院',
    phone: '',
    clinics: [
      { name: '南王庄镇中心卫生院内科', phone: '15833281860' },
      { name: '南王庄镇中心卫生院外科', phone: '13785856514' },
      { name: '南王庄镇中心卫生院儿科', phone: '15614804681' },
      { name: '南王庄镇中心卫生院妇科', phone: '13833865276' },
      { name: '南王庄镇中心卫生院中医科', phone: '13833865276' },
      { name: '南王庄村卫生室', phone: '18630592005' },
      { name: '宅后寺村卫生室', phone: '13932804610' },
      { name: '东河疃村卫生室', phone: '13403280790' },
      { name: '伍新村卫生室', phone: '13180010666' },
      { name: '南王宋村卫生室', phone: '13784189170' },
      { name: '中角村卫生室', phone: '18831816616' },
      { name: '角南村卫生室', phone: '15531865289' },
      { name: '角北村卫生室', phone: '13473812999' },
      { name: '庄火头村卫生室', phone: '13785849208' },
      { name: '谢疃村卫生室', phone: '15512682060' },
      { name: '谷家左村卫生室', phone: '13785875187' },
      { name: '前赵疃村卫生室', phone: '13785881651' },
      { name: '后赵疃村卫生室', phone: '13613188443' },
      { name: '前辛庄村卫生室', phone: '18731805277' },
      { name: '后辛庄村卫生室', phone: '13103182212' },
      { name: '野营村卫生室', phone: '15075898670' },
      { name: '杏贡村卫生室', phone: '13785846051' },
      { name: '王刘乡村卫生室', phone: '13831876945' },
      { name: '李庄村卫生室', phone: '13180012521' },
      { name: '西大转卫生室', phone: '13473801282' },
      { name: '闫大转村卫生室', phone: '13102788081' },
      { name: '李大转村卫生室', phone: '15131863066' },
      { name: '张刘乡村卫生室', phone: '15731869888' },
      { name: '东大转村卫生室', phone: '13932827877' },
    ]
  },
]

export default function YellowPages() {
  const [expandedHospitals, setExpandedHospitals] = useState({})
  const [expandedTownships, setExpandedTownships] = useState({})

  const toggleHospital = (index) => {
    setExpandedHospitals(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const toggleTownship = (index) => {
    setExpandedTownships(prev => ({
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
        <div className="space-y-3">
          {TOWNSHIP_HOSPITALS.map((hospital, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <div
                className="p-4 bg-gray-50 hover:bg-green-50 transition cursor-pointer"
                onClick={() => hospital.clinics.length > 0 && toggleTownship(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{hospital.name}</span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                      {hospital.clinics.length}个卫生室
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTownship(index)
                      }}
                      className="p-2 text-gray-500 hover:text-green-500 transition"
                    >
                      {expandedTownships[index] ? '▲' : '▼'}
                    </button>
                  </div>
                </div>
              </div>

              {expandedTownships[index] && hospital.clinics.length > 0 && (
                <div className="border-t border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">🏘️ 村卫生室电话</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {hospital.clinics.map((clinic, clinicIndex) => (
                      <div
                        key={clinicIndex}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-green-50 transition"
                      >
                        <span className="text-sm text-gray-700 truncate">{clinic.name}</span>
                        <a
                          href={`tel:${clinic.phone}`}
                          className="text-green-600 hover:text-green-700 font-medium text-sm ml-2 shrink-0"
                        >
                          {clinic.phone}
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
