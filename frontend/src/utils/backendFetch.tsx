export async function fetchBackendGET(route: string) {
    const response: Response = await fetch('/api' + route,
      {
        method: 'GET',
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  
    return response;
  }
  
  
  export async function fetchBackendPOST(route: string, data: any) {
    const response = await fetch('/api' + route, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  
    return response;
  
  }
  export async function fetchBackendPUT(route: string, data: any) {
    const response = await fetch('/api' + route, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  
    return response;
  
  }
  
  export async function fetchBackendDELETE(route: string, data?:any) {
    const response = await fetch('/api' + route,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : undefined 
      }
    );
  
    return response;
  
  }