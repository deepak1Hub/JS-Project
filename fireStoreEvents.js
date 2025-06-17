import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { db } from "./firebase.js"; // adjust path if needed

// Your event data JSON
const eventsData = {
    "events": {
      "wedding": [
        { "id":"1","name": "Wedding", "image": "https://image.wedmegood.com/resized/720X/uploads/member/4423446/1718179841_image8684.jpg?crop=9,212,2028,1140", "location" : "Hyderabad", "price" : "100$" },
        { "id":"2","name": "Wedding", "image": "https://i.pinimg.com/564x/42/9b/af/429baf18cbb66c62afa1fcb44918dd6e.jpg", "location" : "Banglore", "price" : "100$" },
        { "id":"3","name": "Wedding", "image": "https://www.grandweddings.co.in/wp-content/uploads/2020/01/Top-Wedding-Event-Management-Companies-in-Hyderabad.jpg", "location" : "Chennai", "price" : "100$" },
        { "id":"4","name": "Wedding", "image": "https://www.fnpweddings.com/wp-content/uploads/2023/01/banner1-1.jpg", "location" : "Mumbai", "price" : "100$" },
        { "id":"5","name": "Wedding", "image": "https://s3-us-west-2.amazonaws.com/shaadiwishnewbucket/b6bf26f0-9c6e-a64a-c0d9-d6da32635f7b.JPG", "location" : "Delhi", "price" : "100$" },
         ],
      "birthday party": [
        { "id":"6","name": "Birthday Party", "image": "https://www.snowfair.in/cdn/shop/products/Grand-Combo.jpg?v=1631614928", "location" : "Hyderabad", "price" : "100$" },
        { "id":"7","name": "Birthday Party", "image": "https://cheetah.cherishx.com/uploads/1626351381_large.jpg", "location" : "Banglore", "price" : "100$" },
        { "id":"8","name": "Birthday Party", "image": "https://5.imimg.com/data5/SELLER/Default/2021/6/CT/SG/RD/12461086/birthday-party-decorators.jpg", "location" : "Chennai", "price" : "100$" },
        { "id":"9","name": "Birthday Party", "image": "https://img.clevup.in/337348/SKU-1154_4-1711150956529.jpg?width=600&format=webp", "location" : "Mumbai", "price" : "100$" },
        { "id":"10","name": "Birthday Party", "image": "https://tentrooftoprestrocafe.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-09-25-at-3.38.47-PM-scaled.jpeg", "location" : "Delhi", "price" : "100$" },
         ],
      "concert": [
        { "id":"11","name": "Concert", "image": "https://imageio.forbes.com/specials-images/imageserve//628c06f838d3f4bcb05ca2cd/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds", "location" : "Hyderabad", "price" : "100$" },
        { "id":"12","name": "Concert", "image": "https://npr.brightspotcdn.com/dims4/default/0b02d8d/2147483647/strip/true/crop/1125x750+0+0/resize/880x587!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fwkms%2Ffiles%2F201912%2Fpexels-photo-1190297.jpeg", "location" : "Banglore", "price" : "100$" },
        { "id":"13","name": "Concert", "image": "https://5.imimg.com/data5/SELLER/Default/2025/2/486430331/QS/LN/YC/240689908/concert-event-management-service.jpg", "location" : "Mumbai", "price" : "100$" },
        { "id":"14","name": "Concert", "image": "https://content.jdmagicbox.com/comp/morbi/i4/9999p2822.2822.170829004016.f6i4/catalogue/nilkanth-events-and-wedding-planner-ravapar-road-morbi-musical-event-htexspv796-250.jpg", "location" : "Delhi", "price" : "100$" },
         ],
      "festival": [
        { "id":"15","name": "Festival", "image": "https://genlish.com/wp-content/uploads/2016/03/Happy-Holi-images-hd.jpg", "location" : "Hyderabad", "price" : "100$" },
        { "id":"16","name": "Festival", "image": "https://ihplb.b-cdn.net/wp-content/uploads/2011/02/Indian-Fiestas.jpg", "location" : "Banglore", "price" : "100$" },
        { "id":"17","name": "Festival", "image": "https://www.festivalsfromindia.com/wp-content/uploads/2022/03/Screenshot-2022-03-05-at-11.12.18-AM.png", "location" : "Chennai", "price" : "100$" },
        { "id":"18","name": "Festival", "image": "https://utsav.gov.in/public/uploads/event_picture_image/event_156/1650698255515653671.jpeg", "location" : "Mumbai", "price" : "100$" },
        { "id":"19","name": "Festival", "image": "https://www.thehosteller.com/_next/image/?url=https%3A%2F%2Fstatic.thehosteller.com%2Fhostel%2Fimages%2Fimage.jpg%2Fimage-1733137759422.jpg&w=2048&q=75", "location" : "Delhi", "price" : "100$" },
         ],
      "baby shower": [
        { "id":"20","name": "Baby Shower", "image": "https://www.gunitevents.com/assets/images/baby-showring/Embracing-Parenthood-With.webp", "location" : "Hyderabad", "price" : "100$" },
        { "id":"21","name": "Baby Shower", "image": "https://thejarvi.com/wp-content/uploads/2023/01/WEL0003.jpg", "location" : "Banglore", "price" : "100$" },
        { "id":"23","name": "Baby Shower", "image": "https://www.honeypeachsg.com/wp-content/uploads/2024/03/12-6.webp", "location" : "Chennai", "price" : "100$" },
        { "id":"24","name": "Baby Shower", "image": "https://media.vyaparify.com/vcards/services/16533/Baby-Shower-Joy.jpg", "location" : "Mumbai", "price" : "100$" },
        { "id":"25","name": "Baby Shower", "image": "https://img1.wsimg.com/isteam/ip/824a7eea-7a45-427d-b622-c7b1c31e37f3/IMG_1041.jpeg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25", "location" : "Delhi", "price" : "100$" },
         ]
    }
  };



// Save data to Firestore
export async function saveEventsToFirestore() {
  try {
    const docRef = doc(db, "eventData", "allEvents");
    await setDoc(docRef, eventsData);
    console.log("Events data saved successfully!");
  } catch (error) {
    console.error("Error saving events data:", error);
  }
}

// Load data from Firestore
export async function loadEventsFromFirestore() {
  try {
    const docRef = doc(db, "eventData", "allEvents");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Events data loaded:", data);
      return data;
    } else {
      console.log("No such document found!");
      return null;
    }
  } catch (error) {
    console.error("Error loading events data:", error);
  }
}

saveEventsToFirestore();
