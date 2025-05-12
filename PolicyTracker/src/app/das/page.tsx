const handleSubmit = async () => {
    try {
      const res = await fetch("/api/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "นโยบายการศึกษา" }),
      });
  
      const result = await res.json();
      console.log(result);
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
    }
  };
  