const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.syncSwimmingData = onRequest({ cors: true }, async (req, res) => {
  console.log(">>> 捕获到数据包，准备解析...");

  try {
    const data = req.body;
    const workouts = (data.data && data.data.workouts) || data.workouts || [];
    
    if (workouts.length === 0) {
      return res.status(200).send("No workouts found in payload.");
    }

    const batch = db.batch();
    let count = 0;

    workouts.forEach((w) => {
      // 核心修复：根据你日志里的 "name": "Pool Swim" 进行匹配
      const workoutName = (w.name || w.workoutType || "").toLowerCase();
      
      if (workoutName.includes("swim") || workoutName.includes("swimming")) {
        const ref = db.collection("swims").doc();
        
        // 精准提取嵌套字段
        const swimDoc = {
          // 距离提取：兼容你日志里的 swimDistance 或直接距离
          distance: w.swimDistance?.qty || w.totalDistance?.qty || w.distance?.qty || 0,
          // 时长：如果是字符串格式需要转换，这里先取原始值
          duration: w.duration || 0, 
          // 心率提取：根据日志 w.heartRate.avg.qty
          avg_hr: w.heartRate?.avg?.qty || w.averageHeartRate?.qty || 0,
          // 能量提取：activeEnergy 通常是数组，取总和或第一项
          active_kcal: w.activeEnergyBurned?.qty || 0, 
          date: admin.firestore.Timestamp.fromDate(new Date(w.start || Date.now())),
          stroke_type: w.name || "Pool Swim",
          swimDistance: w.swimDistance || [], // Store the full swimDistance array
          synced_at: admin.firestore.FieldValue.serverTimestamp()
        };

        // 增加过滤逻辑：如果总距离小于200米，则认为是无效数据
        const totalSwimDistance = swimDoc.distance;
        if (totalSwimDistance < 200) {
          console.log(`❌ 过滤掉一条游泳记录 (距离太短: ${totalSwimDistance} 米):`, {
            name: swimDoc.stroke_type,
            date: swimDoc.date.toDate().toISOString(),
            distance: totalSwimDistance
          });
          return; // 跳过这条记录
        }

        batch.set(ref, swimDoc);
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
      console.log(`✅ 成功！已将 ${count} 条游泳记录同步至 Firestore`);
      return res.status(200).send({ status: "success", count });
    } else {
      console.log("❌ 未匹配到游泳运动。当前记录名称示例:", workouts[0].name);
      return res.status(200).send("No swimming records matched.");
    }
  } catch (err) {
    console.error("🔥 解析崩溃:", err.message);
    return res.status(500).send("Error parsing data");
  }
});