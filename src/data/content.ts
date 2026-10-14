// ALL visible copy lives here. Section 5 text is the client's, verbatim — do not reword.

export const BRAND = {
  name: "THUẬT PROJECT",
  tagline: "Di sản Việt Nam × Tác động xã hội × Phát triển bền vững trong cuộc sống hàng ngày",
};

export const UI = {
  nav: [
    { label: "Câu chuyện dự án", href: "#cau-chuyen" },
    { label: "Bộ sưu tập", href: "#bo-suu-tap" },
    { label: "Lan tỏa yêu thương", href: "#lan-toa" },
  ],
  join: "Đồng hành cùng dự án",
  explore: "Khám phá bộ sưu tập",
  imagePending: "Ảnh đang được cập nhật",
  copyright: "© 2026 THUẬT PROJECT",
  skip: "Bỏ qua đến nội dung",
};

export const HERO = {
  headline: "Mang hồn Việt. Trao hơi ấm",
  text: "THUẬT PROJECT mang di sản văn hóa Việt Nam vào đời sống thường nhật thông qua những chiếc bình giữ nhiệt được thiết kế đầy tâm huyết. Không chỉ là một sản phẩm, mỗi đơn hàng còn là cơ hội sẻ chia hơi ấm và sự quan tâm đến 129 cụ tại Viện Dưỡng lão Thị Nghè.",
  button: "Khám phá bộ sưu tập",
};

export const STORY = {
  label: "CÂU CHUYỆN DỰ ÁN",
  headline: "Một chút hơi ấm, ngàn điều ý nghĩa",
  text: "THUẬT PROJECT bắt đầu từ một niềm tin giản dị: di sản Việt Nam xứng đáng được gìn giữ và tiếp nối, còn lòng tốt xứng đáng được sẻ chia. Bằng cách kết hợp cảm hứng văn hóa dân tộc với những sản phẩm thiết thực trong đời sống, chúng tôi mong muốn tạo nên sự kết nối giữa những gì mỗi người mang theo và những điều họ có thể trao đi. Thông qua dự án, chúng tôi hướng đến gây quỹ hỗ trợ 129 cụ tại Viện Dưỡng lão Thị Nghè, biến những lựa chọn mua sắm thường ngày thành hành động yêu thương.",
  quoteLabel: "Thông điệp cốt lõi",
  quote: "Một sản phẩm hữu ích có thể mang theo câu chuyện văn hóa và góp phần tạo nên những giá trị tốt đẹp cho cộng đồng.",
};

export const COLLECTION = {
  label: "BỘ SƯU TẬP SẢN PHẨM",
  headline: "Hai thiết kế. Một hồn Việt",
  intro: "Khám phá Việt Nam qua hai thiết kế mang dấu ấn riêng, lấy cảm hứng từ vẻ đẹp thiên nhiên và những biểu tượng văn hóa lâu đời. Mỗi chiếc bình đưa một phần bản sắc Việt vào cuộc sống thường ngày của bạn.",
};

export type Product = {
  id: string;
  numeral: string;
  name: string;
  subtitle?: string;
  description?: string;
  design?: string;
  price: string;
};

export const TINH_HOA: Product = {
  id: "tinh-hoa",
  numeral: "01",
  name: "Tinh hoa",
  subtitle: "Tinh hoa văn hóa Việt",
  description: "Lấy cảm hứng từ vẻ đẹp gần gũi của Việt Nam: hoa sen, tre, nón lá, đồng lúa và những hình ảnh thân thuộc của quê hương.",
  design: "Thiết kế: Tông xanh chủ đạo, chữ “Tinh Hoa” viết tay theo phong cách typography Việt, kết hợp họa tiết minh họa thanh lịch.",
  price: "245.000 VNĐ / bình",
};

export const SAO_VANG: Product = {
  id: "sao-vang",
  numeral: "02",
  name: "SAO VÀNG",
  subtitle: "Dấu ấn lịch sử Việt Nam",
  description: "Lấy cảm hứng từ trống đồng Đông Sơn, với hình tượng ngôi sao mặt trời, chim Lạc và các họa tiết hình học truyền thống.",
  design: "Thiết kế: Tông đỏ nổi bật, chữ “Sao Vàng” viết tay theo phong cách typography Việt, kết hợp họa tiết trống đồng mang tinh thần dân tộc.",
  price: "245.000 VNĐ / bình",
};

export const COMBO: Product = {
  id: "combo",
  numeral: "03",
  name: "COMBO 2 SẢN PHẨM",
  price: "475.000 VNĐ/ 2 bình",
};

export const CHARITY = {
  label: "LAN TỎA YÊU THƯƠNG",
  headline: "Ấm đôi tay. Ấm trái tim",
  text: "Đằng sau mỗi chiếc bình THUẬT PROJECT là một mục đích lớn hơn giá trị của sản phẩm. Chúng tôi triển khai dự án nhằm gây quỹ cho chuyến thiện nguyện tại Viện Dưỡng lão Thị Nghè, nơi 129 cụ xứng đáng nhận được sự quan tâm, đồng hành và yêu thương. Mỗi đơn hàng là một bước tiến giúp chúng tôi đưa sứ mệnh này đến gần hơn với hiện thực.",
  count: 129,
  countCaption: "cụ tại Viện Dưỡng lão Thị Nghè",
  button: "Đồng hành cùng dự án",
};

// Alt text (not visible copy).
export const ALT = {
  logo: "Logo THUẬT PROJECT",
  hero: "Các thành viên THUẬT PROJECT giới thiệu bình giữ nhiệt tại gian hàng",
  story: "Nhóm THUẬT PROJECT bên gian hàng bình giữ nhiệt",
  "tinhhoa-1": "Bình giữ nhiệt Tinh hoa tông xanh với họa tiết quê hương Việt Nam",
  "tinhhoa-2": "Họa tiết trải phẳng của thiết kế Tinh hoa: hoa sen, tre, nón lá và kiến trúc Việt",
  "saovang-1": "Bình giữ nhiệt Sao Vàng tông đỏ với họa tiết trống đồng",
  "saovang-2": "Họa tiết trải phẳng của thiết kế Sao Vàng lấy cảm hứng từ trống đồng Đông Sơn",
  combo: "Combo hai bình giữ nhiệt Tinh hoa và Sao Vàng",
  "charity-1": "Các thành viên dự án chụp ảnh cùng các cụ tại Viện Dưỡng lão Thị Nghè",
  "charity-2": "Thành viên dự án trao quà cho các cụ tại viện dưỡng lão",
  "charity-3": "Nhóm thiện nguyện thăm hỏi các cụ trong phòng sinh hoạt chung",
  "charity-4": "Các cụ nhận quà từ nhóm THUẬT PROJECT",
} as const;
