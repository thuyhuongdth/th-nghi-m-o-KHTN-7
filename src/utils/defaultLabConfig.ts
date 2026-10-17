import { LabCustomConfig, StudentSubmission } from '../types';

export const DEFAULT_LAB_CONFIG: LabCustomConfig = {
  experimentId: 'bai-27-ho-hap',
  lessonTitle: 'Bài 27: Thực hành Hô hấp ở thực vật',
  appSubtitle: 'Bí Mật Hơi Thở Của Hạt',
  description: 'Chứng minh hạt đang nảy mầm thực hiện hô hấp tế bào, lấy khí oxygen và thải khí carbon dioxide làm đục nước vôi trong.',
  predictQuestionA: 'Sau một khoảng thời gian, nước vôi ở chuông A (chứa hạt nảy mầm) có thể xảy ra hiện tượng gì?',
  predictOptionsA: [
    { id: 'A_turbid', label: 'Xuất hiện vẩn đục màu trắng sữa', isCorrectTarget: true },
    { id: 'A_no_change', label: 'Hầu như không thay đổi (nước vôi vẫn trong suốt)' },
    { id: 'A_green', label: 'Chuyển sang màu xanh lá cây đậm' },
    { id: 'A_disappear', label: 'Nước vôi bốc hơi biến mất hoàn toàn' },
  ],
  predictQuestionB: 'Em dự đoán điều gì xảy ra với nước vôi ở chuông B (hệ đối chứng không có hạt nảy mầm)?',
  predictOptionsB: [
    { id: 'B_no_change', label: 'Hầu như không thay đổi (vẫn giữ độ trong suốt)', isCorrectTarget: true },
    { id: 'B_turbid', label: 'Xuất hiện vẩn đục trắng nhiều như chuông A' },
    { id: 'B_yellow', label: 'Chuyển sang màu vàng chanh' },
    { id: 'B_boil', label: 'Sôi sủi bọt khí liên tục' },
  ],
  detectiveCases: [
    {
      id: 1,
      title: 'Vụ án 1: Những hạt đậu ngủ say (Dùng hạt khô)',
      scenarioDesc: 'Nhóm bạn Nam dùng hạt đậu khô chưa ngâm ủ để thay thế cho hạt đang nảy mầm trong Chuông A.',
      flawType: 'fatal',
      pedagogicalHint: 'Hạt khô chứa rất ít nước, liệu các phản ứng sống và hô hấp trong phôi có hoạt động mạnh mẽ không?',
      correctAction: 'fix',
      options: [
        {
          id: 'c1_correct',
          text: 'Hạt khô có cường độ hô hấp cực kì yếu, lượng CO₂ giải phóng rất ít không đủ làm đục nước vôi trong thời gian ngắn.',
          isCorrect: true,
          explanation: 'Chính xác! Hạt khô đang ở trạng thái ngủ nghỉ, lượng nước rất thấp nên hô hấp tế bào hầu như ngừng trệ.',
        },
        {
          id: 'c1_wrong1',
          text: 'Hạt khô sẽ hấp thụ hết nước vôi trong làm cốc nước vôi bị cạn sạch.',
          isCorrect: false,
          explanation: 'Hạt để trong đĩa riêng, không tiếp xúc trực tiếp với cốc nước vôi nên không thể hút nước trong cốc.',
        },
        {
          id: 'c1_wrong2',
          text: 'Hạt khô giải phóng ra khí oxygen thay vì carbon dioxide.',
          isCorrect: false,
          explanation: 'Hạt không có diệp lục và không quang hợp để thải oxygen.',
        },
      ],
    },
    {
      id: 2,
      title: 'Vụ án 2: Khe hở vô hình (Chuông A bị hở)',
      scenarioDesc: 'Khi úp chuông thủy tinh A, bạn Lan sơ ý để chân chuông bị vênh một khoảng hở 1 cm so với mặt đế cao su.',
      flawType: 'fatal',
      pedagogicalHint: 'Đậy kín chuông giúp chúng ta kiểm soát điều gì đối với thể tích khí bên trong?',
      correctAction: 'fix',
      options: [
        {
          id: 'c2_correct',
          text: 'Khí CO₂ sinh ra sẽ bị thất thoát ra ngoài môi trường và không khí bên ngoài tràn vào làm sai lệch kết quả.',
          isCorrect: true,
          explanation: 'Đúng rồi! Chuông phải đậy kín để tích lũy lượng CO₂ đủ lớn làm biến đổi nước vôi.',
        },
        {
          id: 'c2_wrong1',
          text: 'Ánh sáng sẽ lọt vào chuông làm hạt đậu nở hoa sớm.',
          isCorrect: false,
          explanation: 'Chuông thủy tinh vốn dĩ trong suốt nên ánh sáng luôn đi qua được.',
        },
        {
          id: 'c2_wrong2',
          text: 'Nước vôi sẽ tràn ra khỏi cốc khi có khe hở.',
          isCorrect: false,
          explanation: 'Khe hở không khí không làm tràn nước trong cốc.',
        },
      ],
    },
    {
      id: 3,
      title: 'Vụ án 3: Hai đối thủ giống hệt nhau (Cả A và B đều có hạt)',
      scenarioDesc: 'Nhóm bạn Minh muốn thí nghiệm chắc chắn hơn nên đã đặt hạt đậu nảy mầm vào CẢ HAI CHUÔNG A VÀ B.',
      flawType: 'fatal',
      pedagogicalHint: 'Thí nghiệm đối chứng có còn khác thí nghiệm chính ở đúng một yếu tố quan trọng không?',
      correctAction: 'fix',
      options: [
        {
          id: 'c3_correct',
          text: 'Mất đi hệ đối chứng! Không còn căn cứ để chứng minh sự biến đổi nước vôi là do hạt đậu nảy mầm gây ra.',
          isCorrect: true,
          explanation: 'Xuất sắc! Nguyên tắc thí nghiệm khoa học là hệ đối chứng phải giữ nguyên mọi yếu tố và chỉ khác biệt ở duy nhất yếu tố cần nghiên cứu (hạt nảy mầm).',
        },
        {
          id: 'c3_wrong1',
          text: 'Đặt hạt ở cả hai chuông sẽ làm chuông thủy tinh bị nổ tung.',
          isCorrect: false,
          explanation: 'Áp suất khí trao đổi ở hạt rất nhỏ, không thể gây nổ.',
        },
        {
          id: 'c3_wrong2',
          text: 'Làm vậy sẽ tốn gấp đôi lượng nước vôi.',
          isCorrect: false,
          explanation: 'Đây chỉ là vấn đề dụng cụ, không phải bản chất phương pháp đối chứng khoa học.',
        },
      ],
    },
    {
      id: 4,
      title: 'Vụ án 4: Cốc nước nhầm lẫn (Dùng nước lọc thường)',
      scenarioDesc: 'Bạn Hoa vội vàng lấy nhầm cốc nước lọc thông thường thay vì cốc nước vôi trong Ca(OH)₂ đặt vào Chuông A.',
      flawType: 'fatal',
      pedagogicalHint: 'Hóa chất nào có đặc tính biến đổi màu sắc khi gặp khí carbon dioxide?',
      correctAction: 'fix',
      options: [
        {
          id: 'c4_correct',
          text: 'Nước lọc thông thường không phản ứng tạo kết tủa với CO₂, nên không thể quan sát hiện tượng để nhận biết.',
          isCorrect: true,
          explanation: 'Chính xác! Nước vôi trong [Ca(OH)₂] tác dụng với CO₂ tạo kết tủa CaCO₃ trắng đục, còn nước lọc thì không.',
        },
        {
          id: 'c4_wrong1',
          text: 'Nước thường sẽ làm hạt đậu nảy mầm nhanh gấp 10 lần.',
          isCorrect: false,
          explanation: 'Cốc nước để riêng không ảnh hưởng trực tiếp đến tốc độ mầm trong đĩa.',
        },
        {
          id: 'c4_wrong2',
          text: 'Nước thường sẽ chuyển thành axit làm thủng chuông.',
          isCorrect: false,
          explanation: 'CO₂ tan tạo axit cacbonic rất yếu, hoàn toàn không thể làm thủng thủy tinh.',
        },
      ],
    },
    {
      id: 5,
      title: 'Vụ án 5: Hạt đậu "ngạt thở" dưới nước (Ngâm ngập 48h)',
      scenarioDesc: 'Trước khi làm thí nghiệm, bạn Hùng ngâm ngập chìm hạt đậu trong chậu nước sâu suốt 48 giờ liên tục.',
      flawType: 'fatal',
      pedagogicalHint: 'Hạt cần nước để nảy mầm nhưng phôi hạt có cần trao đổi khí oxygen với không khí không?',
      correctAction: 'fix',
      options: [
        {
          id: 'c5_correct',
          text: 'Ngâm chìm quá lâu khiến hạt thiếu oxygen để hô hấp hiếu khí, phôi bị ngạt thở, thối rữa và chết.',
          isCorrect: true,
          explanation: 'Tuyệt vời! Hạt cần ẩm nhưng cũng cần không khí để hô hấp. Ngập nước kéo dài gây thiếu O₂ và thối hạt.',
        },
        {
          id: 'c5_wrong1',
          text: 'Hạt sẽ mọc rễ dài 1 mét và làm vỡ chuông.',
          isCorrect: false,
          explanation: 'Hạt ngập nước không thể sinh trưởng bình thường.',
        },
        {
          id: 'c5_wrong2',
          text: 'Vỏ hạt sẽ biến thành đá cứng.',
          isCorrect: false,
          explanation: 'Hạt ngấm nước vỏ sẽ mềm ra chứ không cứng lại.',
        },
      ],
    },
    {
      id: 6,
      title: 'Vụ án 6: Đĩa bông khô cằn (Quên tưới ẩm)',
      scenarioDesc: 'Bạn An quên châm nước vào bông lót đĩa Petri, bông khô rang và hạt nảy mầm bị héo queo.',
      flawType: 'fatal',
      pedagogicalHint: 'Nước đóng vai trò gì đối với các phản ứng sinh hóa bên trong tế bào sống?',
      correctAction: 'fix',
      options: [
        {
          id: 'c6_correct',
          text: 'Thiếu nước làm tế bào phôi bị mất nước nghiêm trọng, quá trình hô hấp tế bào và trao đổi chất bị đình trệ.',
          isCorrect: true,
          explanation: 'Đúng! Nước là dung môi và môi trường cần thiết cho mọi hoạt động trao đổi chất và hô hấp tế bào.',
        },
        {
          id: 'c6_wrong1',
          text: 'Hạt sẽ hút hết khí CO₂ trong chuông để giải khát.',
          isCorrect: false,
          explanation: 'Hạt hô hấp thải CO₂ chứ không hút CO₂ để bù nước.',
        },
        {
          id: 'c6_wrong2',
          text: 'Bông khô sẽ tự bốc cháy tạo ra khói mù mịt.',
          isCorrect: false,
          explanation: 'Ở nhiệt độ phòng bông ẩm không thể tự bốc cháy.',
        },
      ],
    },
  ],
  conclusionKeywords: {
    seed: ['hạt', 'mầm', 'đậu', 'hạt sống', 'hạt nảy mầm'],
    process: ['hô hấp', 'thở', 'trao đổi khí', 'sống', 'hô hấp tế bào'],
    gas: ['co2', 'co₂', 'carbon dioxide', 'cacbonic', 'cacbon đioxit'],
    release: ['thải', 'giải phóng', 'tạo ra', 'sinh ra', 'sinh', 'ra', 'thoát ra'],
  },
  foodQuestion1: {
    question: '1. Vì sao nhiều loại hạt khô thường được ngâm nước ấm trước khi đem nấu hoặc gieo giống?',
    options: [
      { id: 'q1_a', text: 'Để hạt hút đủ nước, kích hoạt enzyme hô hấp và thúc đẩy mầm chuyển hóa chất dinh dưỡng.', isCorrect: true },
      { id: 'q1_b', text: 'Để hạt đổi sang màu đỏ cho đẹp mắt.', isCorrect: false },
      { id: 'q1_c', text: 'Để hạt nặng hơn khi đem bán.', isCorrect: false },
    ],
  },
  foodQuestion2: {
    question: '2. Vì sao khi làm giá đỗ hoặc ngâm giống, người ta không ngâm chìm ngập hạt trong nước suốt nhiều ngày?',
    options: [
      { id: 'q2_a', text: 'Vì ngập nước lâu hạt bị thiếu oxygen để hô hấp, dễ thối rữa và chết mầm.', isCorrect: true },
      { id: 'q2_b', text: 'Vì hạt sẽ bơi mất trong nước.', isCorrect: false },
      { id: 'q2_c', text: 'Vì làm giá đỗ không bao giờ được chạm vào nước.', isCorrect: false },
    ],
  },
};

// Preset Template: Bài 23 Quang hợp ở thực vật
export const PRESET_BAI_23_QUANG_HOP: LabCustomConfig = {
  experimentId: 'bai-23-quang-hop',
  lessonTitle: 'Bài 23: Thực hành Quang hợp ở thực vật',
  appSubtitle: 'Khám Phá Dòng Khí Oxy Từ Lá Cây',
  description: 'Chứng minh cành rong đuôi chó khi được chiếu sáng sẽ quang hợp giải phóng bọt khí oxygen (O₂) làm que đóm bùng cháy.',
  predictQuestionA: 'Sau khi chiếu đèn vào cành rong ở cốc A, em dự đoán hiện tượng gì sẽ xảy ra ở đầu cành rong?',
  predictOptionsA: [
    { id: 'A_oxygen_bubbles', label: 'Xuất hiện các bọt khí nổi lên liên tục từ vết cắt của cành rong', isCorrectTarget: true },
    { id: 'A_no_change', label: 'Cành rong không có bất kì hiện tượng gì' },
    { id: 'A_turbid', label: 'Nước trong cốc chuyển sang màu đen kịt' },
    { id: 'A_shrink', label: 'Cành rong bị teo nhỏ lại và biến mất' },
  ],
  predictQuestionB: 'Ở cốc B để trong bóng tối hoàn toàn (đối chứng), hiện tượng gì xảy ra?',
  predictOptionsB: [
    { id: 'B_no_bubbles', label: 'Hầu như không thấy bọt khí nào thoát ra', isCorrectTarget: true },
    { id: 'B_bubbles', label: 'Bọt khí thoát ra nhiều gấp đôi cốc A' },
    { id: 'B_glow', label: 'Cành rong phát sáng trong đêm' },
  ],
  detectiveCases: [
    {
      id: 1,
      title: 'Vụ án 1: Cành rong giả bằng nhựa',
      scenarioDesc: 'Học sinh nhầm lẫn dùng cành rong giả bằng nhựa đặt vào cốc thí nghiệm và bật đèn chiếu sáng.',
      flawType: 'fatal',
      pedagogicalHint: 'Chỉ các tế bào sống chứa diệp lục mới có khả năng quang hợp.',
      correctAction: 'fix',
      options: [
        {
          id: 'c1_correct',
          text: 'Rong nhựa không có lục lạp và diệp lục, không phải cơ thể sống nên không thể xảy ra phản ứng quang hợp tạo O₂.',
          isCorrect: true,
          explanation: 'Chính xác! Quang hợp là quá trình sinh học chỉ có ở thực vật và sinh vật tự dưỡng có diệp lục.',
        },
        {
          id: 'c1_wrong',
          text: 'Rong nhựa sẽ tan chảy làm thủng cốc thủy tinh.',
          isCorrect: false,
          explanation: 'Nhiệt độ đèn chiếu bình thường không làm tan chảy nhựa trong nước.',
        },
      ],
    },
    {
      id: 2,
      title: 'Vụ án 2: Quên bật đèn chiếu sáng',
      scenarioDesc: 'Đặt cành rong thật vào cốc A nhưng quên cắm điện bật đèn chiếu sáng.',
      flawType: 'fatal',
      pedagogicalHint: 'Năng lượng ánh sáng đóng vai trò gì trong phản ứng quang hợp?',
      correctAction: 'fix',
      options: [
        {
          id: 'c2_correct',
          text: 'Không có ánh sáng cung cấp năng lượng thì diệp lục không thể thực hiện pha sáng quang hợp để phân ly nước giải phóng O₂.',
          isCorrect: true,
          explanation: 'Đúng rồi! Ánh sáng là điều kiện tiên quyết để thực vật quang hợp.',
        },
        {
          id: 'c2_wrong',
          text: 'Cành rong sẽ ăn hết nước trong cốc.',
          isCorrect: false,
          explanation: 'Không có ánh sáng cành rong chỉ hô hấp yếu, không hút cạn cốc nước.',
        },
      ],
    },
    {
      id: 3,
      title: 'Vụ án 3: Dùng nước đun sôi để nguội lâu ngày',
      scenarioDesc: 'Dùng nước đun sôi để nguội đã đuổi hết khí CO₂ hòa tan để làm môi trường cho rong quang hợp.',
      flawType: 'fatal',
      pedagogicalHint: 'Nguyên liệu đầu vào của quá trình quang hợp là gì?',
      correctAction: 'fix',
      options: [
        {
          id: 'c3_correct',
          text: 'Nước đun sôi thiếu khí carbon dioxide (CO₂) - là nguyên liệu cần thiết để cây quang hợp tạo chất hữu cơ.',
          isCorrect: true,
          explanation: 'Rất chính xác! Quang hợp cần nước và khí CO₂ làm nguyên liệu.',
        },
        {
          id: 'c3_wrong',
          text: 'Nước đun sôi sẽ làm cành rong nở hoa sớm.',
          isCorrect: false,
          explanation: 'Nước sôi nguội không làm cành rong ra hoa.',
        },
      ],
    },
  ],
  conclusionKeywords: {
    seed: ['cành rong', 'rong', 'thực vật', 'lá cây', 'cây xanh'],
    process: ['quang hợp', 'chiếu sáng', 'ánh sáng'],
    gas: ['oxygen', 'oxy', 'o2', 'khí oxy', 'bọt khí'],
    release: ['giải phóng', 'thải ra', 'tạo ra', 'sinh ra'],
  },
  foodQuestion1: {
    question: '1. Vì sao trong bể nuôi cá cảnh, người ta thường trồng thêm các cây thủy sinh (rong, bèo)?',
    options: [
      { id: 'q1_a', text: 'Để cây thủy sinh quang hợp cung cấp khí oxygen cho cá hô hấp và hấp thu bớt CO₂.', isCorrect: true },
      { id: 'q1_b', text: 'Để cá không bơi ra khỏi bể.', isCorrect: false },
    ],
  },
  foodQuestion2: {
    question: '2. Vì sao ban đêm không nên để quá nhiều chậu cây xanh trong phòng ngủ đóng kín cửa?',
    options: [
      { id: 'q2_a', text: 'Vì ban đêm không có ánh sáng cây không quang hợp mà chỉ hô hấp lấy O₂ và thải CO₂, gây ngột ngạt cho con người.', isCorrect: true },
      { id: 'q2_b', text: 'Vì cây sẽ hút hết bóng tối của căn phòng.', isCorrect: false },
    ],
  },
};

// Preset Template: Bài 28 Thoát hơi nước ở lá cây
export const PRESET_BAI_28_THOAT_HOI_NUOC: LabCustomConfig = {
  experimentId: 'bai-28-thoat-hoi-nuoc',
  lessonTitle: 'Bài 28: Thực hành Thoát hơi nước ở lá',
  appSubtitle: 'Bí Mật Khí Khổng Và Giọt Nước',
  description: 'Chứng minh quá trình thoát hơi nước diễn ra chủ yếu qua lá nhờ so sánh cành có lá và cành vặt trụi lá được trùm túi nilon trong suốt.',
  predictQuestionA: 'Sau 1 giờ để ngoài sáng, bên trong túi nilon bọc cành có đầy đủ lá (Túi A) có hiện tượng gì?',
  predictOptionsA: [
    { id: 'A_water_drops', label: 'Thành túi nilon bị mờ hơi sương và đọng nhiều giọt nước nhỏ', isCorrectTarget: true },
    { id: 'A_no_change', label: 'Túi nilon hoàn toàn khô ráo' },
    { id: 'A_burn', label: 'Túi nilon bị bốc cháy' },
  ],
  predictQuestionB: 'Ở túi B bọc cành đã bị vặt trụi hết lá (đối chứng), hiện tượng gì xảy ra?',
  predictOptionsB: [
    { id: 'B_dry', label: 'Thành túi vẫn trong suốt, hầu như không có hoặc rất ít giọt nước', isCorrectTarget: true },
    { id: 'B_lots_drops', label: 'Đọng nước nhiều như túi A' },
  ],
  detectiveCases: [
    {
      id: 1,
      title: 'Vụ án 1: Túi nilon bị thủng nhiều lỗ',
      scenarioDesc: 'Học sinh dùng túi nilon bị rách đáy để trùm cành cây.',
      flawType: 'fatal',
      pedagogicalHint: 'Hơi nước thoát ra có giữ lại được để quan sát không?',
      correctAction: 'fix',
      options: [
        {
          id: 'c1_correct',
          text: 'Hơi nước thoát ra từ lá sẽ bay thẳng ra không khí ngoài mà không đọng lại trên thành túi.',
          isCorrect: true,
          explanation: 'Túi phải kín tuyệt đối để hơi nước ngưng tụ thành các giọt nước nhìn thấy được.',
        },
        {
          id: 'c1_wrong',
          text: 'Túi thủng sẽ làm cây hút hết gió trời.',
          isCorrect: false,
          explanation: 'Gió không làm cây mất nước ngay lập tức theo cách này.',
        },
      ],
    },
    {
      id: 2,
      title: 'Vụ án 2: Buộc túi trùm cả miệng chậu đất ẩm',
      scenarioDesc: 'Học sinh trùm túi nilon bao kín cả mặt chậu đất thay vì chỉ buộc riêng quanh cành cây.',
      flawType: 'fatal',
      pedagogicalHint: 'Nước bốc hơi từ đâu sẽ làm sai lệch nguồn gốc?',
      correctAction: 'fix',
      options: [
        {
          id: 'c2_correct',
          text: 'Hơi nước bốc lên từ mặt đất ẩm sẽ đọng vào túi, không chứng minh được nước là do lá cây thoát ra.',
          isCorrect: true,
          explanation: 'Rất tinh ý! Cần bọc kín mặt chậu hoặc chỉ bọc cành để loại trừ hơi nước bốc lên từ đất.',
        },
        {
          id: 'c2_wrong',
          text: 'Đất sẽ chui vào lá cây làm lá bị xám màu.',
          isCorrect: false,
          explanation: 'Đất không thể chui vào mô lá.',
        },
      ],
    },
  ],
  conclusionKeywords: {
    seed: ['lá cây', 'cành cây', 'lá', 'cây'],
    process: ['thoát hơi nước', 'bốc hơi', 'khí khổng'],
    gas: ['hơi nước', 'nước', 'giọt nước'],
    release: ['thoát ra', 'ngưng tụ', 'thải ra'],
  },
  foodQuestion1: {
    question: '1. Vì sao khi bứng cây đi trồng nơi khác, người ta thường tỉa bớt lá?',
    options: [
      { id: 'q1_a', text: 'Để giảm bớt sự thoát hơi nước qua lá khi rễ cây chưa kịp bén đất hút nước, giúp cây không bị héo chết.', isCorrect: true },
      { id: 'q1_b', text: 'Để cho cây trông nhỏ gọn hơn khi di chuyển.', isCorrect: false },
    ],
  },
  foodQuestion2: {
    question: '2. Vì sao vào những ngày nắng nóng gay gắt, cây trồng cần được tưới nước nhiều hơn?',
    options: [
      { id: 'q2_a', text: 'Vì nhiệt độ cao làm khí khổng mở rộng và tốc độ thoát hơi nước tăng vọt để làm mát lá.', isCorrect: true },
      { id: 'q2_b', text: 'Vì cây muốn ngâm chân dưới nước.', isCorrect: false },
    ],
  },
};

// Storage keys
const LAB_CONFIG_STORAGE_KEY = 'bio_lab_7_custom_config_v1';
const SUBMISSIONS_STORAGE_KEY = 'bio_lab_7_student_submissions_v1';
const TEACHER_PWD_KEY = 'bio_lab_7_teacher_pwd_v1';
const DEFAULT_TEACHER_PWD = 'giaovien2018';

export const LabStorage = {
  getConfig(): LabCustomConfig {
    try {
      const data = localStorage.getItem(LAB_CONFIG_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return DEFAULT_LAB_CONFIG;
  },

  saveConfig(config: LabCustomConfig) {
    try {
      localStorage.setItem(LAB_CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
  },

  resetConfig() {
    try {
      localStorage.removeItem(LAB_CONFIG_STORAGE_KEY);
    } catch {
      // ignore
    }
    return DEFAULT_LAB_CONFIG;
  },

  getSubmissions(): StudentSubmission[] {
    try {
      const data = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [];
  },

  saveSubmission(sub: StudentSubmission) {
    try {
      const list = this.getSubmissions();
      // Replace existing submission for same student if exists, or append
      const existingIdx = list.findIndex((item) => item.name.toLowerCase() === sub.name.toLowerCase() && item.studentClass === sub.studentClass);
      if (existingIdx >= 0) {
        list[existingIdx] = sub;
      } else {
        list.unshift(sub);
      }
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  },

  clearSubmissions() {
    try {
      localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  seedDemoSubmissions(): StudentSubmission[] {
    const demos: StudentSubmission[] = [
      {
        id: 'sub-1',
        name: 'Trần Minh Đức',
        studentClass: '7A1',
        completedAt: '17/10/2026, 08:35:12',
        totalScore: 95,
        badge: '🏅 NHÀ KHOA HỌC THỰC VẬT XUẤT SẮC',
        scores: { prep: 10, assembly: 20, predict: 10, simulate: 15, detective: 25, conclusion: 15 },
        predictions: { jarA: 'A_turbid', jarB: 'B_no_change', reason: 'Hạt nảy mầm hô hấp thải CO2 làm đục nước vôi' },
        observations: { jarA_phenomenon: 'turbid', jarA_explanation: 'resp_co2', jarB_phenomenon: 'clear', jarB_explanation: 'no_source' },
        conclusion: 'Hạt đang nảy mầm thực hiện hô hấp tế bào, sử dụng oxygen và thải khí carbon dioxide làm đục nước vôi trong.',
      },
      {
        id: 'sub-2',
        name: 'Nguyễn Thị Thu Hà',
        studentClass: '7A1',
        completedAt: '17/10/2026, 09:12:40',
        totalScore: 90,
        badge: '🏅 NHÀ KHOA HỌC THỰC VẬT XUẤT SẮC',
        scores: { prep: 10, assembly: 20, predict: 10, simulate: 15, detective: 20, conclusion: 15 },
        predictions: { jarA: 'A_turbid', jarB: 'B_no_change', reason: 'Nước vôi gặp CO2 sẽ bị vẩn đục' },
        observations: { jarA_phenomenon: 'turbid', jarA_explanation: 'resp_co2', jarB_phenomenon: 'clear', jarB_explanation: 'no_source' },
        conclusion: 'Hạt đậu nảy mầm có sự sống và hô hấp tạo ra khí CO2.',
      },
      {
        id: 'sub-3',
        name: 'Lê Hoàng Long',
        studentClass: '7A2',
        completedAt: '17/10/2026, 09:45:18',
        totalScore: 80,
        badge: '🌟 NHÀ NGHIÊN CỨU TÀI NĂNG',
        scores: { prep: 10, assembly: 20, predict: 10, simulate: 15, detective: 15, conclusion: 10 },
        predictions: { jarA: 'A_turbid', jarB: 'B_no_change', reason: 'Dự đoán nước vôi chuông A bị đục' },
        observations: { jarA_phenomenon: 'turbid', jarA_explanation: 'resp_co2', jarB_phenomenon: 'clear', jarB_explanation: 'no_source' },
        conclusion: 'Hạt nảy mầm hô hấp giải phóng carbon dioxide.',
      },
      {
        id: 'sub-4',
        name: 'Phạm Bảo Châu',
        studentClass: '7A2',
        completedAt: '17/10/2026, 10:05:02',
        totalScore: 100,
        badge: '🏅 NHÀ KHOA HỌC THỰC VẬT XUẤT SẮC',
        scores: { prep: 10, assembly: 20, predict: 10, simulate: 15, detective: 30, conclusion: 15 },
        predictions: { jarA: 'A_turbid', jarB: 'B_no_change', reason: 'Chuông A có nguồn sinh CO2 là hạt mầm' },
        observations: { jarA_phenomenon: 'turbid', jarA_explanation: 'resp_co2', jarB_phenomenon: 'clear', jarB_explanation: 'no_source' },
        conclusion: 'Trong quá trình nảy mầm, hạt đậu hô hấp mạnh mẽ, lấy khí O2 và giải phóng khí CO2 làm kết tủa nước vôi trong.',
      },
    ];
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(demos));
    } catch {}
    return demos;
  },

  getTeacherPassword(): string {
    try {
      const pwd = localStorage.getItem(TEACHER_PWD_KEY);
      if (pwd) return pwd;
    } catch {}
    return DEFAULT_TEACHER_PWD;
  },

  setTeacherPassword(newPwd: string) {
    try {
      localStorage.setItem(TEACHER_PWD_KEY, newPwd);
    } catch {}
  },
};
