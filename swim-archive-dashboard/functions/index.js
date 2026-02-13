const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// 设置一个你自己的 API Key，稍后填入 Health Auto Export 的 Header 中
const AUTH_API_KEY = "Swim_2026_Secure";

exports.syncSwimmingData = functions.https.onRequest(async (req, res) => {
  console.log("收到请求方法:", req.method);
  console.log("收到请求头:", JSON.stringify(req.headers));
  console.log("收到原始数据体:", JSON.stringify(req.body));
  // 1. 安全验证：检查请求头中的 API Key
  const apiKey = req.get("x-api-key");
  if (!apiKey || apiKey !== AUTH_API_KEY) {
    console.error("未授权的访问尝试");
    return res.status(401).send("Unauthorized: Invalid API Key");
  }

  // 2. 仅处理 POST 请求
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const data = req.body;
    
    // Health Auto Export 通常将数据包装在 data.workouts 数组中
    // 如果是直接导出单个记录，请根据 App 实际设置调整
    const workouts = data.data && data.data.workouts ? data.data.workouts : [];
    
    if (workouts.length === 0) {
      return res.status(200).send("No workout data found in request.");
    }

    const batch = db.batch();
    let swimCount = 0;

    workouts.forEach((workout) => {
      // 3. 数据过滤：仅同步游泳数据
      // 注意：Health Auto Export 的类型名称可能是 "swimming" 或 "SWIMMING"
      if (workout.workoutType.toLowerCase().includes("swimming")) {
        const swimRef = db.collection("swims").doc(); // 自动生成 ID
        
        // 4. 数据映射
        const swimDoc = {
          id: swimRef.id,
          distance: workout.totalDistance || 0,
          duration: workout.duration || 0,
          avg_hr: workout.averageHeartRate || 0,
          active_kcal: workout.activeEnergyBurned || 0,
          date: admin.firestore.Timestamp.fromDate(new Date(workout.start)), // 转换日期格式
          stroke_type: "Freestyle", // 默认值，如果 App 没提供细分
          synced_at: admin.firestore.FieldValue.serverTimestamp()
        };

        batch.set(swimRef, swimDoc);
        swimCount++;
      }
    });

    if (swimCount > 0) {
      await batch.commit();
      console.log(`成功同步了 ${swimCount} 条游泳记录`);
      return res.status(200).send({ message: `Successfully synced ${swimCount} swim records.` });
    } else {
      return res.status(200).send("No swimming workouts to sync.");
    }

  } catch (error) {
    console.error("同步数据时出错:", error);
    return res.status(500).send("Internal Server Error");
  }
});
