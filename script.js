function checkGrade() {
    const id = document.getElementById("studentId").value.trim();
    const result = document.getElementById("result");
    const idCard = document.getElementById("idCard");
    const qrCodeDiv = document.getElementById("qrCode");

    result.innerText = "";
    idCard.innerHTML = "";
    qrCodeDiv.innerHTML = "";

    if (!/^\d{5}$/.test(id)) {
        result.innerText = "❌ 학번은 정확히 5자리 숫자여야 합니다.";
        return;
    }

    // 우선 급식권 여부 확인
    const isPriority = confirm("우선 급식권이 있나요?");
    if (isPriority) {
        const isSports = confirm("점심 스포츠 클럽인가요?");
        if (isSports) {
            const sport = prompt("스포츠 종목을 입력하세요 (배구, 배드민턴, 농구, 걸스포츠)").trim();
            const day = ["일", "월", "화", "수", "목", "금", "토"][new Date().getDay()];
            const allowedDays = {
                "배구": ["월"],
                "배드민턴": ["화", "금"],
                "농구": ["목"],
                "걸스포츠": ["수"]
            };

            if (!allowedDays[sport]) {
                result.innerText = "❌ 등록되지 않은 종목입니다.";
                return;
            }

            if (!allowedDays[sport].includes(day)) {
                result.innerText = `❌ 오늘은 ${sport} 종목을 사용할 수 없는 요일입니다. 다음에는 주의하세요!`;
                return;
            }

            result.innerText = `✅ ${sport} 클럽 활동으로 우선 입장 가능합니다.`;
        } else {
            result.innerText = "✅ 우선 급식권으로 바로 입장 가능합니다.";
        }
        displayIdCard(id);
        createQRCode(id);
        qrCodeDiv.style.display = "flex";
        return;
    }
    result.innerText = "⏳ 아직 점심 시간이 아닙니다. 조금만 기다려 주세요.";
    
// 우선권이 없으면 학년별 시간 체크
const grade = id.charAt(0);
const current = getCurrentTimeInfo();
const nowTotal = current.hours * 60 + current.minutes;

const allowTimes = {
    "3": { hour: 13, minute: 0 },
    "2": { hour: 13, minute: 6 },
    "1": { hour: 13, minute: 10 }
};

const { hour, minute } = allowTimes[grade] || { hour: 13, minute: 10 }; // 기본 1학년 시간

const allowedTotal = hour * 60 + minute;
const waitMinutes = minutesUntil(hour, minute);

if (nowTotal < allowedTotal) {
    result.innerText = `⏳ 아직 ${grade}학년 입장 시간이 아닙니다. ${waitMinutes}분 남았습니다.`;
    return;
}

result.innerText = `✅ ${grade}학년입니다. 입장 가능합니다. 아래 QR을 스캔하세요.`;
displayIdCard(id);
createQRCode(id);
qrCodeDiv.style.display = "flex";
}

function createQRCode(id) {
    const qrCodeDiv = document.getElementById("qrCode");
    qrCodeDiv.innerHTML = "";
    new QRCode(qrCodeDiv, {
        text: id,
        width: 128,
        height: 128
    });
}

function displayIdCard(id) {
    const idCard = document.getElementById("idCard");
    const student = getStudentData(id);

    if (!student) {
        idCard.innerHTML = `<p>학생 정보를 찾을 수 없습니다.</p>`;
        return;
    }

    idCard.innerHTML = `
        <div class="id-card">
            <h3>학생증</h3>
            <img src="${student.image}" alt="${student.name}" />
            <p><strong>이름:</strong> ${student.name}</p>
            <p><strong>학번:</strong> ${id}</p>
            <p><strong>학과:</strong> ${student.department}</p>
        </div>
    `;
}

// 학생 데이터 가져오기 (기본 데이터 + 랜덤 데이터 포함)
function getStudentData(id) {
    let student = studentData[id];
    if (!student) {
        const classNum = parseInt(id.charAt(2));
        let department = "미확인";
        let imageRange = [];
        if ([1, 2].includes(classNum)) {
            department = "AI융합전자과";
            imageRange = [19, 20, 21];
        } else if ([3, 4].includes(classNum)) {
            department = "스마트자동화과";
            imageRange = [13, 14, 15];
        } else if ([5, 6].includes(classNum)) {
            department = "디자인콘텐츠과";
            imageRange = [7, 8, 9];
        } else if ([7, 8].includes(classNum)) {
            department = "IT소프트웨어과";
            imageRange = [1, 2, 3];
        }
        const imgNum = imageRange[Math.floor(Math.random() * imageRange.length)];
        const name = randomNames[Math.floor(Math.random() * randomNames.length)];
        student = { name, department, image: `image/학생-${imgNum}.png` };
    }
    return student;
}

const studentData = {
    "30712": { name: "이소현", department: "IT소프트웨어과", image: "image/학생-1.png" }
};

const randomNames = ["김민준", "이서윤", "박지우", "최하늘", "정예준", "한지민", "윤도윤", "장서연", "홍지호"];
