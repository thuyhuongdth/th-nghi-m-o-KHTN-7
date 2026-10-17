import { LabLessonConfig, StudentSubmissionRecord } from '../types';

export const DEFAULT_LESSON_CONFIG: LabLessonConfig = {
  lessonCode: 'Bài 27',
  lessonName: 'Thực hành: Hô hấp ở thực vật',
  subtitle: 'Bí Mật Hơi Thở Của Hạt',
  topic: 'Chứng minh hạt nảy mầm hô hấp thải khí carbon dioxide (CO₂)',
  prepSteps: [
    {
      id: 1,
      correctIndex: 0,
      title: 'Lựa chọn hạt đậu chất lượng',
      desc: 'Chọn những hạt đậu to tròn, chắc mẩy, nguyên vẹn, không bị sâu mọt hay nứt vỡ.',
    },
    {
      id: 2,
      correctIndex: 1,
      title: 'Rửa sạch hạt với nước',
      desc: 'Loại bỏ bụi bẩn và các vi sinh vật nấm mốc bám trên bề mặt vỏ hạt.',
    },
    {
      id: 3,
      correctIndex: 2,
      title: 'Ngâm hạt trong nước ấm',
      desc: 'Ngâm hạt đậu khoảng 4–6 giờ (nước ấm 35–40°C) để đánh thức phôi hạt hút no nước.',
    },
    {
      id: 4,
      correctIndex: 3,
      title: 'Đặt lên đĩa lót bông ẩm',
      desc: 'Trải đều hạt lên đĩa Petri đã lót lớp bông thấm nước hoặc khăn ẩm để cung cấp nước liên tục.',
    },
    {
      id: 5,
      correctIndex: 4,
      title: 'Ủ hạt ở điều kiện thích hợp',
      desc: 'Đặt đĩa hạt ở nơi ấm áp (khoảng 25–30°C), thoáng khí, tránh ánh nắng gắt trực tiếp.',
    },
    {
      id: 6,
      correctIndex: 5,
      title: 'Thu nhận hạt đã nảy mầm',
      desc: 'Khi hạt đã nứt vỏ, nhú mầm non trắng dài khoảng 0.5–1 cm, đem dùng ngay cho thí nghiệm.',
    },
  ],
  detectiveCases: [
    {
      id: 1,
      title: 'Vụ án 1: Những hạt đậu ngủ say',
      scenarioDesc: 'Nhóm bạn Nam dùng hạt đậu khô chưa ngâm ủ để thay thế cho hạt đang nảy mầm trong Chuông A.',
      pedagogicalHint: 'Hạt khô chứa rất ít nước, liệu các phản ứng sống và hô hấp trong phôi có hoạt động mạnh mẽ không?',
      options: [
        {
          id: 'c1_correct',
          text: 'Hạt khô có cường độ hô hấp cực kì yếu, lượng CO₂ giải phóng rất ít không đủ làm đục nước vôi trong thời gian ngắn.',
          isCorrect: true,
          explanation: 'Chính xác! Hạt khô đang ở trạng thái ngủ nghỉ, lượng nước rất thấp nên hô hấp tế bào hầu như ngừng trệ.',
        },
        {
          id: 'c1_w1',
          text: 'Hạt khô sẽ hấp thụ hết nước vôi trong làm cốc nước vôi bị cạn sạch.',
          isCorrect: false,
          explanation: 'Hạt để trong đĩa riêng, không tiếp xúc trực tiếp với cốc nước vôi.',
        },
        {
          id: 'c1_w2',
          text: 'Hạt khô giải phóng ra khí oxygen thay vì carbon dioxide.',
          isCorrect: false,
          explanation: 'Hạt không có chất diệp lục và không quang hợp để tạo oxygen.',
        },
      ],
    },
    {
      id: 2,
      title: 'Vụ án 2: Khe hở vô hình',
      scenarioDesc: 'Khi úp chuông thủy tinh A, bạn Lan sơ ý để chân chuông bị vênh một khoảng hở 1 cm so với mặt đế cao su.',
      pedagogicalHint: 'Đậy kín chuông giúp chúng ta kiểm soát điều gì đối với thể tích khí bên trong?',
      options: [
        {
          id: 'c2_correct',
          text: 'Khí CO₂ sinh ra sẽ bị thất thoát ra ngoài môi trường và không khí bên ngoài tràn vào làm sai lệch kết quả.',
          isCorrect: true,
          explanation: 'Đúng rồi! Chuông phải đậy kín để tích lũy lượng CO₂ đủ lớn làm biến đổi nước vôi.',
        },
        {
          id: 'c2_w1',
          text: 'Ánh sáng sẽ lọt vào chuông làm hạt đậu nở hoa sớm.',
          isCorrect: false,
          explanation: 'Chuông thủy tinh vốn trong suốt nên ánh sáng luôn chiếu qua được.',
        },
        {
          id: 'c2_w2',
          text: 'Nước vôi sẽ tràn ra khỏi cốc khi có khe hở.',
          isCorrect: false,
          explanation: 'Khe hở không khí không làm tràn nước trong cốc.',
        },
      ],
    },
    {
      id: 3,
      title: 'Vụ án 3: Hai đối thủ giống hệt nhau',
      scenarioDesc: 'Nhóm bạn Minh muốn thí nghiệm chắc chắn hơn nên đã đặt hạt đậu nảy mầm vào CẢ HAI CHUÔNG A VÀ B.',
      pedagogicalHint: 'Thí nghiệm đối chứng có còn khác thí nghiệm chính ở đúng một yếu tố quan trọng không?',
      options: [
        {
          id: 'c3_correct',
          text: 'Mất đi hệ đối chứng! Không còn căn cứ để chứng minh sự biến đổi nước vôi là do hạt đậu nảy mầm gây ra.',
          isCorrect: true,
          explanation: 'Xuất sắc! Nguyên tắc thí nghiệm khoa học là hệ đối chứng phải giữ nguyên mọi yếu tố và chỉ khác biệt ở duy nhất yếu tố cần nghiên cứu (hạt nảy mầm).',
        },
        {
          id: 'c3_w1',
          text: 'Đặt hạt ở cả hai chuông sẽ làm chuông thủy tinh bị nổ tung.',
          isCorrect: false,
          explanation: 'Áp suất khí trao đổi ở hạt rất nhỏ, không thể gây nổ.',
        },
        {
          id: 'c3_w2',
          text: 'Làm vậy sẽ tốn gấp đôi lượng nước vôi.',
          isCorrect: false,
          explanation: 'Đây chỉ là vấn đề dụng cụ, không phải bản chất phương pháp đối chứng khoa học.',
        },
      ],
    },
    {
      id: 4,
      title: 'Vụ án 4: Cốc nước nhầm lẫn',
      scenarioDesc: 'Bạn Hoa vội vàng lấy nhầm cốc nước lọc thông thường thay vì cốc nước vôi trong Ca(OH)₂ đặt vào Chuông A.',
      pedagogicalHint: 'Hóa chất nào có đặc tính biến đổi màu sắc khi gặp khí carbon dioxide?',
      options: [
        {
          id: 'c4_correct',
          text: 'Nước lọc thông thường không phản ứng tạo kết tủa với CO₂, nên không thể quan sát hiện tượng để nhận biết.',
          isCorrect: true,
          explanation: 'Chính xác! Nước vôi trong [Ca(OH)₂] tác dụng với CO₂ tạo kết tủa CaCO₃ trắng đục, còn nước lọc thì không.',
        },
        {
          id: 'c4_w1',
          text: 'Nước thường sẽ làm hạt đậu nảy mầm nhanh gấp 10 lần.',
          isCorrect: false,
          explanation: 'Cốc nước để riêng không ảnh hưởng trực tiếp đến tốc độ mầm trong đĩa.',
        },
        {
          id: 'c4_w2',
          text: 'Nước thường sẽ chuyển thành axit làm thủng chuông.',
          isCorrect: false,
          explanation: 'Axit cacbonic rất yếu, không thể làm thủng thủy tinh.',
        },
      ],
    },
    {
      id: 5,
      title: 'Vụ án 5: Hạt đậu "ngạt thở" dưới nước',
      scenarioDesc: 'Trước khi làm thí nghiệm, bạn Hùng ngâm ngập chìm hạt đậu trong chậu nước sâu suốt 48 giờ liên tục.',
      pedagogicalHint: 'Hạt cần nước để nảy mầm nhưng phôi hạt có cần trao đổi khí oxygen với không khí không?',
      options: [
        {
          id: 'c5_correct',
          text: 'Ngâm chìm quá lâu khiến hạt thiếu oxygen để hô hấp hiếu khí, phôi bị ngạt thở, thối rữa và chết.',
          isCorrect: true,
          explanation: 'Tuyệt vời! Hạt cần ẩm nhưng cũng cần không khí để hô hấp. Ngập nước kéo dài gây thiếu O₂ và thối hạt.',
        },
        {
          id: 'c5_w1',
          text: 'Hạt sẽ mọc rễ dài 1 mét và làm vỡ chuông.',
          isCorrect: false,
          explanation: 'Hạt ngập nước không thể sinh trưởng bình thường.',
        },
        {
          id: 'c5_w2',
          text: 'Vỏ hạt sẽ biến thành đá cứng.',
          isCorrect: false,
          explanation: 'Hạt ngấm nước vỏ mềm ra chứ không cứng lại.',
        },
      ],
    },
    {
      id: 6,
      title: 'Vụ án 6: Đĩa bông khô cằn',
      scenarioDesc: 'Bạn An quên châm nước vào bông lót đĩa Petri, bông khô rang và hạt nảy mầm bị héo queo.',
      pedagogicalHint: 'Nước đóng vai trò gì đối với các phản ứng sinh hóa bên trong tế bào sống?',
      options: [
        {
          id: 'c6_correct',
          text: 'Thiếu nước làm tế bào phôi bị mất nước nghiêm trọng, quá trình hô hấp tế bào và trao đổi chất bị đình trệ.',
          isCorrect: true,
          explanation: 'Đúng! Nước là dung môi và môi trường cần thiết cho mọi hoạt động trao đổi chất và hô hấp tế bào.',
        },
        {
          id: 'c6_w1',
          text: 'Hạt sẽ hút hết khí CO₂ trong chuông để giải khát.',
          isCorrect: false,
          explanation: 'Hạt hô hấp thải CO₂ chứ không hút CO₂ bù nước.',
        },
        {
          id: 'c6_w2',
          text: 'Bông khô sẽ tự bốc cháy tạo ra khói mù mịt.',
          isCorrect: false,
          explanation: 'Bông ẩm bình thường không thể tự bốc cháy ở nhiệt độ phòng.',
        },
      ],
    },
  ],
  practicalQuestions: [
    {
      id: 'q1',
      question: 'Vì sao nhiều loại hạt khô thường được ngâm nước ấm trước khi đem nấu hoặc gieo giống?',
      options: [
        {
          id: 'q1_a',
          text: 'Để hạt hút đủ nước, kích hoạt enzyme hô hấp và thúc đẩy mầm chuyển hóa chất dinh dưỡng.',
          isCorrect: true,
        },
        {
          id: 'q1_b',
          text: 'Để hạt đổi sang màu đỏ cho đẹp mắt.',
          isCorrect: false,
        },
        {
          id: 'q1_c',
          text: 'Để hạt nặng hơn khi đem bán.',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'q2',
      question: 'Vì sao khi làm giá đỗ hoặc ngâm giống, người ta không ngâm chìm ngập hạt trong nước suốt nhiều ngày?',
      options: [
        {
          id: 'q2_a',
          text: 'Vì ngập nước lâu hạt bị thiếu oxygen để hô hấp, dễ thối rữa và chết mầm.',
          isCorrect: true,
        },
        {
          id: 'q2_b',
          text: 'Vì hạt sẽ bơi mất trong nước.',
          isCorrect: false,
        },
        {
          id: 'q2_c',
          text: 'Vì làm giá đỗ không bao giờ được chạm vào nước.',
          isCorrect: false,
        },
      ],
    },
  ],
};

// Preset templates for other KHTN 7 biology practical labs:
export const PRESET_KHTN7_TEMPLATES: Record<string, LabLessonConfig> = {
  ho_hap_hat: DEFAULT_LESSON_CONFIG,

  quang_hop_la: {
    lessonCode: 'Bài 23',
    lessonName: 'Thực hành: Quang hợp ở cây xanh',
    subtitle: 'Nhà Máy Tinh Bột & Khí Oxygen',
    topic: 'Chứng minh lá cây chế tạo tinh bột khi có ánh sáng và giải phóng khí Oxygen',
    prepSteps: [
      {
        id: 1,
        correctIndex: 0,
        title: 'Để chậu cây trong bóng tối 2 ngày',
        desc: 'Để toàn bộ tinh bột có sẵn trong lá tiêu hao hết trước khi làm thí nghiệm.',
      },
      {
        id: 2,
        correctIndex: 1,
        title: 'Bịt một phần lá bằng băng giấy đen',
        desc: 'Ngăn không cho ánh sáng chiếu vào phần lá được dán băng giấy.',
      },
      {
        id: 3,
        correctIndex: 2,
        title: 'Đem chậu cây ra chiếu sáng 4-6 giờ',
        desc: 'Cho lá thực hiện quá trình quang hợp ở phần không bị che.',
      },
      {
        id: 4,
        correctIndex: 3,
        title: 'Ngắt lá, đun cách thủy trong cồn 90°',
        desc: 'Tẩy hết chất diệp lục ra khỏi lá để lá có màu trắng ngà dễ quan sát màu tinh bột.',
      },
      {
        id: 5,
        correctIndex: 4,
        title: 'Rửa lá trong nước ấm',
        desc: 'Làm mềm phiến lá sau khi đun trong cồn.',
      },
      {
        id: 6,
        correctIndex: 5,
        title: 'Nhúng lá vào dung dịch thuốc thử Lugol (Iot)',
        desc: 'Thuốc thử iot chuyển màu xanh tím đặc trưng khi gặp tinh bột.',
      },
    ],
    detectiveCases: [
      {
        id: 1,
        title: 'Vụ án 1: Quên để cây trong bóng tối trước thí nghiệm',
        scenarioDesc: 'Học sinh lấy ngay lá cây ngoài vườn đang có sẵn nhiều tinh bột đem thí nghiệm.',
        pedagogicalHint: 'Nếu trong lá còn sẵn tinh bột thì làm sao biết tinh bột mới được tạo ra nhờ ánh sáng?',
        options: [
          {
            id: 'c1_correct',
            text: 'Cả phần bị che và không che đều đổi màu xanh tím, không chứng minh được vai trò của ánh sáng.',
            isCorrect: true,
            explanation: 'Đúng! Cần để trong bóng tối 48h để lá tiêu hao hết tinh bột cũ.',
          },
          {
            id: 'c1_w1',
            text: 'Lá cây sẽ biến thành màu vàng ngay lập tức.',
            isCorrect: false,
            explanation: 'Lá không đổi vàng khi chưa tẩy diệp lục.',
          },
        ],
      },
      {
        id: 2,
        title: 'Vụ án 2: Dùng giấy trắng trong suốt thay cho giấy đen',
        scenarioDesc: 'Học sinh dùng giấy can trong suốt dán lên lá thay vì giấy đen cản quang.',
        pedagogicalHint: 'Giấy trắng có chặn được ánh sáng mặt trời không?',
        options: [
          {
            id: 'c2_correct',
            text: 'Ánh sáng vẫn xuyên qua giấy trắng, phần dán vẫn quang hợp tạo tinh bột nên mất tác dụng che sáng.',
            isCorrect: true,
            explanation: 'Chính xác! Cần giấy đen hoặc giấy thiếc để chắn sáng hoàn toàn.',
          },
          {
            id: 'c2_w1',
            text: 'Giấy trắng làm lá cây bị lạnh buốt.',
            isCorrect: false,
            explanation: 'Giấy trắng không ảnh hưởng nhiệt độ lá.',
          },
        ],
      },
    ],
    practicalQuestions: [
      {
        id: 'q1',
        question: 'Tại sao cần đun cách thủy lá trong cồn mà không đun trực tiếp trên ngọn lửa đèn cồn?',
        options: [
          {
            id: 'q1_a',
            text: 'Vì cồn rất dễ bắt lửa và bốc cháy nguy hiểm, đun cách thủy an toàn cho phòng thực hành.',
            isCorrect: true,
          },
          {
            id: 'q1_b',
            text: 'Vì đun trực tiếp lá sẽ nở hoa.',
            isCorrect: false,
          },
        ],
      },
    ],
  },

  thoat_hoi_nuoc: {
    lessonCode: 'Bài 28',
    lessonName: 'Thực hành: Thoát hơi nước ở lá cây',
    subtitle: 'Đo Lường Hơi Thở Của Đại Ngàn',
    topic: 'Chứng minh quá trình thoát hơi nước qua khí khổng ở bề mặt lá',
    prepSteps: [
      {
        id: 1,
        correctIndex: 0,
        title: 'Chọn 2 cành cây có kích thước và số lá tương đương',
        desc: 'Đảm bảo tính đồng đều giữa hệ thí nghiệm và hệ đối chứng.',
      },
      {
        id: 2,
        correctIndex: 1,
        title: 'Ngắt toàn bộ lá của cành B (đối chứng)',
        desc: 'Cành A giữ nguyên lá, cành B ngắt hết lá để so sánh.',
      },
      {
        id: 3,
        correctIndex: 2,
        title: 'Trùm túi nilon trong suốt vào cả 2 cành',
        desc: 'Túi nilon giúp giữ lại lượng hơi nước thoát ra để quan sát.',
      },
      {
        id: 4,
        correctIndex: 3,
        title: 'Buộc chặt miệng túi nilon vào gốc cành',
        desc: 'Ngăn hơi nước từ đất hoặc môi trường bên ngoài lọt vào túi.',
      },
      {
        id: 5,
        correctIndex: 4,
        title: 'Đặt 2 cành dưới ánh sáng mặt trời 1-2 giờ',
        desc: 'Kích thích khí khổng ở lá mở ra để thoát hơi nước.',
      },
      {
        id: 6,
        correctIndex: 5,
        title: 'Quan sát các giọt nước đọng trên thành túi',
        desc: 'Túi cành A có nhiều giọt nước ngưng tụ, túi cành B không có.',
      },
    ],
    detectiveCases: [
      {
        id: 1,
        title: 'Vụ án 1: Buộc lỏng miệng túi nilon',
        scenarioDesc: 'Miệng túi bị hở toang hoác làm gió lùa vào bên trong.',
        pedagogicalHint: 'Hơi nước thoát ra có đọng lại được không khi túi bị hở?',
        options: [
          {
            id: 'c1_correct',
            text: 'Hơi nước thoát ra sẽ bay mất ra ngoài không khí, không thể ngưng tụ thành giọt trên túi.',
            isCorrect: true,
            explanation: 'Đúng! Miệng túi phải được buộc kín chặt.',
          },
          {
            id: 'c1_w1',
            text: 'Lá cây sẽ tự rụng hết.',
            isCorrect: false,
            explanation: 'Gió không làm rụng lá nhanh như vậy.',
          },
        ],
      },
    ],
    practicalQuestions: [
      {
        id: 'q1',
        question: 'Vì sao khi trồng cây người ta thường tỉa bớt lá trước khi bứng đi trồng nơi mới?',
        options: [
          {
            id: 'q1_a',
            text: 'Để giảm bớt sự thoát hơi nước, giúp cây không bị héo chết khi rễ mới chưa hút được nhiều nước.',
            isCorrect: true,
          },
          {
            id: 'q1_b',
            text: 'Để cây nhẹ hơn khi chở trên xe.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
};

const CONFIG_STORAGE_KEY = 'bio_lab_7_lesson_config';
const SUBMISSIONS_STORAGE_KEY = 'bio_lab_7_student_submissions';

export function getStoredLessonConfig(): LabLessonConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return DEFAULT_LESSON_CONFIG;
}

export function saveLessonConfig(cfg: LabLessonConfig) {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(cfg));
  } catch {}
}

export function resetLessonConfig(): LabLessonConfig {
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  } catch {}
  return DEFAULT_LESSON_CONFIG;
}

export function getStoredSubmissions(): StudentSubmissionRecord[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

export function saveSubmission(record: StudentSubmissionRecord) {
  try {
    const list = getStoredSubmissions();
    const existingIndex = list.findIndex(r => r.id === record.id || (r.studentName === record.studentName && r.studentClass === record.studentClass));
    if (existingIndex >= 0) {
      list[existingIndex] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export function clearAllSubmissions() {
  try {
    localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
  } catch {}
}
