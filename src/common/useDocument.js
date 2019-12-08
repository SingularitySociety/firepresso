import { useState, useEffect } from 'react';

// This function asynchronously fetches a Firestore document specified by the path and returns it. 
// It returns null the document does not exist.
// It returns undefined if the path is null or undefined.
function useDocument(db, path) {
  const [document, setDocument] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(()=>{
    if (path) {
      const ref = db.doc(path);
      async function fetchDocument() {
        try {
          const snapshot = await ref.get();
          setDocument(snapshot.exists ? snapshot.data() : null);
        } catch(e) {
          console.log(e);
          setError(e);
        }
      }
      fetchDocument();
    } else {
      setDocument(undefined);
    }
  }, [db, path]);

  return [document, error];
}

export default useDocument;