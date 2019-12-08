import { useState, useEffect } from 'react';

// This function asynchronously fetches a Firestore document specified by the path and returns it. 
// It returns null the document does not exist.
// It returns undefined if the path is null or undefined.
// WARNING: queryFilter must be a static function, not a callback function. 
// Otherwise, it will be called infinitly.
function useOnCollection(db, path, queryFilter) {
  const [collection, setCollection] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let detacher = null;
    if (path) {
      try {
        let ref = db.collection(path);
        if (queryFilter) {
          ref = queryFilter(ref); // optional query filters
        }
        detacher = ref.onSnapshot((snapshot)=>{
          const list = [];
          snapshot.forEach((doc)=>{
            list.push(doc.data());
          });
          setCollection(list);
        }, (err) => {
          console.log("err 1", err);
          setCollection([]);
          setError(err);
        });
      } catch(err) {
        console.log("err 2", err);
        setError(err);
      }
    } else {
      setCollection([]);
    }
    return detacher;
  }, [db, path, queryFilter]);

  return [collection, error];
}

export default useOnCollection;