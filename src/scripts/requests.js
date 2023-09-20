const token = JSON.parse(localStorage.getItem('@kenzieEmpresas:token')) || '';
const baseURL = 'https://api-kenzie-empresas-32u8.onrender.com';
const requestHeaders = {
	'Content-Type': 'application/json',
	Authorization: `Bearer ${token}`,
};

//VERIFICAR TIPO DE USUÁRIO
//1
export async function validateUserType() {
	const userType = await fetch(`${baseURL}/auth/validate_user`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json().then(({ is_admin }) => is_admin);
		}
	});
	return userType;
}

//ROTAS QUE NÃO UTILIZAM TOKEN
//2
export async function registerUser(registerBody) {
	const newUser = await fetch(`${baseURL}/auth/register`, {
		method: 'POST',
		headers: requestHeaders,
		body: JSON.stringify(registerBody),
	}).then(response => {
		if (response.ok) {
			setTimeout(() => {
				window.location.replace('./login.html');
			}, 5000);
			return response.json();
		} else {
			return response.json().then(({ error }) => error[0]);
		}
	});
	return newUser;
}

//3
export async function loginRequest(loginBody) {
	const token = await fetch(`${baseURL}/auth/login`, {
		method: 'POST',
		headers: requestHeaders,
		body: JSON.stringify(loginBody),
	}).then(response => {
		if (response.ok) {
			const responseJson = response.json().then(({ token }) => {
				localStorage.setItem('@kenzieEmpresas:token', JSON.stringify(token));

				return token;
			});
			const isAdmin = validateUserType(responseJson);
			if (isAdmin) {
				window.location.replace('./adminpage.html');
			} else {
				window.location.replace('./userpage.html');
			}
			return responseJson;
		} else {
			return response.json().then(({ error }) => error);
		}
	});
	return token;
}

//4
export async function listAllCompanies() {
	const allCompanies = await fetch(`${baseURL}/companies`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return allCompanies;
}

//5
export async function listCompaniesBySector(sector) {
	const companiesBySector = await fetch(`${baseURL}/companies/${sector}`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return companiesBySector;
}

//6
export async function listAllSectors() {
	const allSectors = await fetch(`${baseURL}/sectors`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return allSectors;
}

//EMPLOYEE ROUTES
//7
export async function getEmployeeInfo() {
	const employee = await fetch(`${baseURL}/users/profile`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return employee;
}

//8
export async function getAllEmployeesFromDepartment() {
	const allEmployeesFromDepartment = await fetch(`${baseURL}/users/departments/coworkers`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return allEmployeesFromDepartment;
}

//9
export async function getAllDepartmentsFromCompany() {
	const allDepartmentsFromCompany = await fetch(`${baseURL}/users/departments`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return allDepartmentsFromCompany;
}

//10
export async function updateUserInfo(employeeBody) {
	const employee = await fetch(`${baseURL}/users`, {
		method: 'PATCH',
		headers: requestHeaders,
		body: JSON.stringify(employeeBody),
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return employee;
}

//ADMIN ROUTES
//11
export async function getAllEmployees() {
	const allEmployees = await fetch(`${baseURL}/users`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return allEmployees;
}

//12
export async function getDepartmentlessEmployees() {
	const allDepartmentlessEmployees = await fetch(`${baseURL}/admin/out_of_work`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return allDepartmentlessEmployees;
}

//13
export async function updateEmployeeInfo(employeeId, employeeBody) {
	const employee = await fetch(`${baseURL}/admin/update_user/${employeeId}`, {
		method: 'PATCH',
		headers: requestHeaders,
		body: JSON.stringify(employeeBody),
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return employee;
}

//14
export async function deleteEmployee(employeeId) {
	await fetch(`${baseURL}/admin/delete_user/${employeeId}`, {
		method: 'DELETE',
		headers: requestHeaders,
	}).then(response => {
		if (!response.ok) {
			response.json().then(responseJson => {
				return responseJson;
			});
		}
	});
}

//ADMIN ROUTES - COMPANIES
//15
export async function registerCompany(registerBody) {
	const newCompany = await fetch(`${baseURL}/companies`, {
		method: 'POST',
		headers: requestHeaders,
		body: JSON.stringify(registerBody),
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return newCompany;
}

//ADMIN ROUTES - DEPARTMENTS
//16
export async function getAllDepartments() {
	const allDepartments = await fetch(`${baseURL}/departments`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return allDepartments;
}

//17
export async function getAllCompanyDepartments(companyId) {
	const allCompanyDepartments = await fetch(`${baseURL}/departments/${companyId}`, {
		method: 'GET',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return allCompanyDepartments;
}

//18
export async function createDepartment(departmentBody) {
	const newDepartment = await fetch(`${baseURL}/departments`, {
		method: 'POST',
		headers: requestHeaders,
		body: JSON.stringify(departmentBody),
	}).then(response => {
		if (response.ok) {
			const postJson = response.json().then(resJson => {
				return resJson;
			});
			return postJson;
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return newDepartment;
}

//19
export async function hireEmployee(employeeId, departmentId) {
	const hiredEmployee = await fetch(`${baseURL}/departments/hire`, {
		method: 'PATCH',
		headers: requestHeaders,
		body: JSON.stringify({
			user_uuid: employeeId,
			department_uuid: departmentId,
		}),
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return hiredEmployee;
}

//20
export async function dismissEmployee(employeeId) {
	const dismissedEmployee = await fetch(`${baseURL}/departments/dismiss/${employeeId}`, {
		method: 'PATCH',
		headers: requestHeaders,
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return dismissedEmployee;
}

//21
export async function updateDepartment(departmentId, departmentBody) {
	const department = await fetch(`${baseURL}/departments/${departmentId}`, {
		method: 'PATCH',
		headers: requestHeaders,
		body: JSON.stringify(departmentBody),
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			response.json().then(responseJson => {
				console.log(responseJson);
			});
		}
	});
	return department;
}

//22
export async function deleteDepartment(departmentId) {
	await fetch(`${baseURL}/departments/${departmentId}`, {
		method: 'DELETE',
		headers: requestHeaders,
	}).then(response => {
		if (!response.ok) {
			response.json().then(responseJson => {
				return responseJson;
			});
		}
	});
}
