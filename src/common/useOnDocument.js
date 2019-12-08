import { useState, useEffect } from 'react';

// This function asynchronously fetches a Firestore document specified by the path and returns it. 
// It returns null the document does not exist.
// It returns undefined if the path is null or undefined.
function useOnDocument(db, path) {
  const [document, setDocument] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let detacher = undefined;
    if (path) {
      try {
        const ref = db.doc(path);
        detacher = ref.onSnapshot((snapshot)=>{
          setDocument(snapshot.exists ? snapshot.data() : null);
        });
      } catch(e) {
        console.log(e);
        setError(e);
      }
    } else {
      setDocument(undefined);
    }
    return detacher;
  }, [db, path]);

  return [document, error];
}

export default useOnDocument;