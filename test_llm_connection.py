#!/usr/bin/env python3
"""
LLM Connection Test Tool
用于测试和诊断大语言模型API连接问题的工具
"""

import sys
import json
import time
import argparse
from datetime import datetime
from typing import Optional, Dict, List, Any
from dataclasses import dataclass, field

try:
    import requests
except ImportError:
    print("错误: 缺少 requests 库")
    print("请运行: pip install requests")
    sys.exit(1)

# 颜色代码（简单实现，不依赖colorama）
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

@dataclass
class TestResult:
    """测试结果数据类"""
    test_name: str
    status: str  # 'PASS', 'FAIL', 'WARN'
    message: str
    details: Optional[Dict] = None
    duration: Optional[float] = None
    timestamp: datetime = field(default_factory=datetime.now)
    
    def __str__(self):
        status_icon = {
            'PASS': f'{Colors.GREEN}✓{Colors.END}',
            'FAIL': f'{Colors.RED}✗{Colors.END}',
            'WARN': f'{Colors.YELLOW}⚠{Colors.END}'
        }
        icon = status_icon.get(self.status, '?')
        return f"  {icon} {self.message}"


class LLMConnectionTester:
    """LLM连接测试器主类"""
    
    def __init__(self, backend_url: str, token: Optional[str] = None, 
                 student_id: str = "123", verbose: bool = False):
        self.backend_url = backend_url.rstrip('/')
        self.token = token
        self.student_id = student_id
        self.verbose = verbose
        self.results: List[TestResult] = []
        self.api_base = f"{self.backend_url}/api"
        self.chat_endpoint = f"{self.api_base}/student-portraits/chat"
        
    def log(self, message: str, level: str = "INFO"):
        """日志输出"""
        if self.verbose or level in ["ERROR", "WARN"]:
            timestamp = datetime.now().strftime("%H:%M:%S")
            color = {
                "INFO": Colors.CYAN,
                "ERROR": Colors.RED,
                "WARN": Colors.YELLOW,
                "SUCCESS": Colors.GREEN
            }.get(level, "")
            print(f"[{timestamp}] {color}{level}{Colors.END}: {message}")
    
    def print_header(self, text: str):
        """打印标题"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.BLUE}{text.center(70)}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.END}\n")
    
    def print_section(self, text: str):
        """打印章节"""
        print(f"\n{Colors.BOLD}{text}{Colors.END}")
        print(f"{'-'*70}")
    
    def test_server_connectivity(self) -> TestResult:
        """测试1: 服务器连通性"""
        self.log(f"测试服务器连通性: {self.backend_url}")
        start_time = time.time()
        
        try:
            response = requests.get(self.backend_url, timeout=10)
            duration = time.time() - start_time
            
            if response.status_code < 500:
                return TestResult(
                    test_name="服务器连通性",
                    status="PASS",
                    message=f"服务器可达 (响应时间: {duration*1000:.0f}ms, 状态码: {response.status_code})",
                    duration=duration,
                    details={"status_code": response.status_code, "response_time_ms": duration*1000}
                )
            else:
                return TestResult(
                    test_name="服务器连通性",
                    status="FAIL",
                    message=f"服务器返回错误 (状态码: {response.status_code})",
                    duration=duration,
                    details={"status_code": response.status_code, "error": response.text[:200]}
                )
                
        except requests.exceptions.Timeout:
            return TestResult(
                test_name="服务器连通性",
                status="FAIL",
                message="连接超时 (>10秒)",
                details={"error": "Connection timeout"}
            )
        except requests.exceptions.ConnectionError as e:
            return TestResult(
                test_name="服务器连通性",
                status="FAIL",
                message=f"无法连接到服务器: {str(e)}",
                details={"error": str(e)}
            )
        except Exception as e:
            return TestResult(
                test_name="服务器连通性",
                status="FAIL",
                message=f"未知错误: {str(e)}",
                details={"error": str(e)}
            )
    
    def test_endpoint_exists(self) -> TestResult:
        """测试2: 端点存在性"""
        self.log(f"测试端点: {self.chat_endpoint}")
        
        headers = {}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            # 尝试OPTIONS请求检查端点
            response = requests.options(self.chat_endpoint, headers=headers, timeout=10)
            
            if response.status_code == 404:
                return TestResult(
                    test_name="端点存在性",
                    status="FAIL",
                    message=f"端点不存在 (404): {self.chat_endpoint}",
                    details={"status_code": 404, "endpoint": self.chat_endpoint}
                )
            
            # 尝试POST请求（可能会因为缺少数据而失败，但至少能确认端点存在）
            test_data = {"question": "test"}
            response = requests.post(self.chat_endpoint, json=test_data, headers=headers, timeout=10)
            
            if response.status_code == 404:
                return TestResult(
                    test_name="端点存在性",
                    status="FAIL",
                    message=f"端点不存在 (404): {self.chat_endpoint}",
                    details={"status_code": 404, "endpoint": self.chat_endpoint}
                )
            else:
                return TestResult(
                    test_name="端点存在性",
                    status="PASS",
                    message=f"端点存在 (状态码: {response.status_code})",
                    details={"status_code": response.status_code}
                )
                
        except requests.exceptions.ConnectionError:
            return TestResult(
                test_name="端点存在性",
                status="FAIL",
                message="无法连接到服务器",
                details={"error": "Connection failed"}
            )
        except Exception as e:
            return TestResult(
                test_name="端点存在性",
                status="WARN",
                message=f"无法确定端点状态: {str(e)}",
                details={"error": str(e)}
            )
    
    def test_authentication(self) -> TestResult:
        """测试3: 认证"""
        if not self.token:
            return TestResult(
                test_name="认证测试",
                status="WARN",
                message="未提供token，跳过认证测试",
                details={"token_provided": False}
            )
        
        self.log("测试JWT认证")
        headers = {'Authorization': f'Bearer {self.token}'}
        
        try:
            # 测试 /users/me 端点来验证token
            me_endpoint = f"{self.api_base}/users/me"
            response = requests.get(me_endpoint, headers=headers, timeout=10)
            
            if response.status_code == 200:
                user_data = response.json()
                return TestResult(
                    test_name="认证测试",
                    status="PASS",
                    message=f"认证成功 (用户: {user_data.get('username', 'unknown')})",
                    details={"authenticated": True, "user": user_data.get('username')}
                )
            elif response.status_code == 401:
                return TestResult(
                    test_name="认证测试",
                    status="FAIL",
                    message="Token无效或已过期 (401)",
                    details={"status_code": 401, "error": response.text[:200]}
                )
            else:
                return TestResult(
                    test_name="认证测试",
                    status="WARN",
                    message=f"认证状态不明确 (状态码: {response.status_code})",
                    details={"status_code": response.status_code}
                )
                
        except Exception as e:
            return TestResult(
                test_name="认证测试",
                status="FAIL",
                message=f"认证测试失败: {str(e)}",
                details={"error": str(e)}
            )
    
    def test_request_format(self, question: str = "测试问题") -> List[TestResult]:
        """测试4-5: 请求格式"""
        results = []
        
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        # 格式1: Direct format (直接格式)
        self.log("测试请求格式: Direct")
        direct_data = {
            "question": question,
            "student_id": self.student_id
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                self.chat_endpoint,
                json=direct_data,
                headers=headers,
                timeout=30
            )
            duration = time.time() - start_time
            
            self.log(f"Direct格式响应: 状态码={response.status_code}, 耗时={duration:.2f}s")
            
            if self.verbose:
                self.log(f"请求数据: {json.dumps(direct_data, ensure_ascii=False, indent=2)}")
                self.log(f"响应头: {dict(response.headers)}")
                try:
                    self.log(f"响应体: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
                except:
                    self.log(f"响应体 (非JSON): {response.text[:500]}")
            
            if response.status_code == 200:
                results.append(TestResult(
                    test_name="请求格式 (Direct)",
                    status="PASS",
                    message=f"Direct格式被接受 (耗时: {duration:.2f}s)",
                    duration=duration,
                    details={
                        "format": "direct",
                        "status_code": 200,
                        "response_preview": response.text[:100]
                    }
                ))
            else:
                error_msg = response.text[:200] if response.text else "无错误信息"
                results.append(TestResult(
                    test_name="请求格式 (Direct)",
                    status="FAIL",
                    message=f"Direct格式被拒绝 (状态码: {response.status_code})",
                    duration=duration,
                    details={
                        "format": "direct",
                        "status_code": response.status_code,
                        "error": error_msg
                    }
                ))
                
        except requests.exceptions.Timeout:
            results.append(TestResult(
                test_name="请求格式 (Direct)",
                status="FAIL",
                message="请求超时 (>30秒)",
                details={"format": "direct", "error": "timeout"}
            ))
        except Exception as e:
            results.append(TestResult(
                test_name="请求格式 (Direct)",
                status="FAIL",
                message=f"请求失败: {str(e)}",
                details={"format": "direct", "error": str(e)}
            ))
        
        # 格式2: Wrapped format (Strapi v5风格)
        self.log("测试请求格式: Wrapped (Strapi v5)")
        wrapped_data = {
            "data": {
                "question": question,
                "student_id": self.student_id
            }
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                self.chat_endpoint,
                json=wrapped_data,
                headers=headers,
                timeout=30
            )
            duration = time.time() - start_time
            
            self.log(f"Wrapped格式响应: 状态码={response.status_code}, 耗时={duration:.2f}s")
            
            if self.verbose:
                self.log(f"请求数据: {json.dumps(wrapped_data, ensure_ascii=False, indent=2)}")
                try:
                    self.log(f"响应体: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
                except:
                    self.log(f"响应体 (非JSON): {response.text[:500]}")
            
            if response.status_code == 200:
                results.append(TestResult(
                    test_name="请求格式 (Wrapped)",
                    status="PASS",
                    message=f"Wrapped格式被接受 (耗时: {duration:.2f}s)",
                    duration=duration,
                    details={
                        "format": "wrapped",
                        "status_code": 200,
                        "response_preview": response.text[:100]
                    }
                ))
            else:
                error_msg = response.text[:200] if response.text else "无错误信息"
                results.append(TestResult(
                    test_name="请求格式 (Wrapped)",
                    status="FAIL",
                    message=f"Wrapped格式被拒绝 (状态码: {response.status_code})",
                    duration=duration,
                    details={
                        "format": "wrapped",
                        "status_code": response.status_code,
                        "error": error_msg
                    }
                ))
                
        except requests.exceptions.Timeout:
            results.append(TestResult(
                test_name="请求格式 (Wrapped)",
                status="FAIL",
                message="请求超时 (>30秒)",
                details={"format": "wrapped", "error": "timeout"}
            ))
        except Exception as e:
            results.append(TestResult(
                test_name="请求格式 (Wrapped)",
                status="FAIL",
                message=f"请求失败: {str(e)}",
                details={"format": "wrapped", "error": str(e)}
            ))
        
        return results
    
    def validate_response(self, response_data: Any) -> TestResult:
        """测试6: 验证响应结构"""
        self.log("验证响应数据结构")
        
        known_fields = ['response', 'message', 'answer', 'reply', 'data']
        found_fields = []
        ai_message = None
        
        try:
            # 如果响应是字符串
            if isinstance(response_data, str):
                return TestResult(
                    test_name="响应结构验证",
                    status="PASS",
                    message="响应是纯文本字符串",
                    details={
                        "type": "string",
                        "preview": response_data[:100]
                    }
                )
            
            # 如果响应是字典
            if isinstance(response_data, dict):
                # 检查已知字段
                for field in known_fields:
                    if field in response_data:
                        found_fields.append(field)
                        if ai_message is None and isinstance(response_data[field], str):
                            ai_message = response_data[field]
                
                # 检查嵌套的data字段
                if 'data' in response_data and isinstance(response_data['data'], dict):
                    for field in known_fields:
                        if field in response_data['data']:
                            found_fields.append(f"data.{field}")
                            if ai_message is None and isinstance(response_data['data'][field], str):
                                ai_message = response_data['data'][field]
                
                if found_fields:
                    return TestResult(
                        test_name="响应结构验证",
                        status="PASS",
                        message=f"找到响应字段: {', '.join(found_fields)}",
                        details={
                            "found_fields": found_fields,
                            "ai_message_preview": ai_message[:100] if ai_message else None,
                            "all_fields": list(response_data.keys())
                        }
                    )
                else:
                    return TestResult(
                        test_name="响应结构验证",
                        status="WARN",
                        message=f"未找到已知响应字段，可用字段: {list(response_data.keys())}",
                        details={
                            "available_fields": list(response_data.keys()),
                            "expected_fields": known_fields
                        }
                    )
            
            return TestResult(
                test_name="响应结构验证",
                status="WARN",
                message=f"未知的响应类型: {type(response_data)}",
                details={"type": str(type(response_data))}
            )
            
        except Exception as e:
            return TestResult(
                test_name="响应结构验证",
                status="FAIL",
                message=f"验证失败: {str(e)}",
                details={"error": str(e)}
            )
    
    def run_all_tests(self, question: str = "请分析我的学习成果数据"):
        """运行所有测试"""
        self.print_header("LLM Connection Test Tool v1.0")
        
        print(f"配置信息:")
        print(f"  后端URL: {self.backend_url}")
        print(f"  API端点: {self.chat_endpoint}")
        print(f"  学生ID: {self.student_id}")
        print(f"  Token: {'已提供' if self.token else '未提供'}")
        print(f"  详细模式: {'开启' if self.verbose else '关闭'}")
        
        # 测试1: 服务器连通性
        self.print_section("[1/6] 测试服务器连通性")
        result = self.test_server_connectivity()
        self.results.append(result)
        print(result)
        
        if result.status == "FAIL":
            print(f"\n{Colors.RED}严重错误: 无法连接到服务器，后续测试将被跳过{Colors.END}")
            self.print_report()
            return
        
        # 测试2: 端点存在性
        self.print_section("[2/6] 测试端点存在性")
        result = self.test_endpoint_exists()
        self.results.append(result)
        print(result)
        
        # 测试3: 认证
        self.print_section("[3/6] 测试认证")
        result = self.test_authentication()
        self.results.append(result)
        print(result)
        
        # 测试4-5: 请求格式
        self.print_section("[4-5/6] 测试请求格式")
        format_results = self.test_request_format(question)
        self.results.extend(format_results)
        for result in format_results:
            print(result)
            
            # 如果某个格式成功，验证响应
            if result.status == "PASS" and result.details and 'response_preview' in result.details:
                self.print_section("[6/6] 验证响应结构")
                # 尝试获取完整响应进行验证
                try:
                    headers = {'Content-Type': 'application/json'}
                    if self.token:
                        headers['Authorization'] = f'Bearer {self.token}'
                    
                    test_data = {"question": question, "student_id": self.student_id}
                    if result.details['format'] == 'wrapped':
                        test_data = {"data": test_data}
                    
                    response = requests.post(self.chat_endpoint, json=test_data, headers=headers, timeout=30)
                    if response.status_code == 200:
                        try:
                            response_data = response.json()
                        except:
                            response_data = response.text
                        
                        validation_result = self.validate_response(response_data)
                        self.results.append(validation_result)
                        print(validation_result)
                        break
                except:
                    pass
        
        # 打印报告
        self.print_report()
    
    def print_report(self):
        """打印测试报告"""
        self.print_header("测试报告")
        
        # 统计
        total = len(self.results)
        passed = sum(1 for r in self.results if r.status == "PASS")
        failed = sum(1 for r in self.results if r.status == "FAIL")
        warned = sum(1 for r in self.results if r.status == "WARN")
        
        print(f"总测试数: {total}")
        print(f"{Colors.GREEN}通过: {passed}{Colors.END}")
        print(f"{Colors.RED}失败: {failed}{Colors.END}")
        print(f"{Colors.YELLOW}警告: {warned}{Colors.END}")
        
        # 建议
        self.print_section("诊断建议")
        
        # 检查服务器连通性
        server_test = next((r for r in self.results if r.test_name == "服务器连通性"), None)
        if server_test and server_test.status == "FAIL":
            print(f"{Colors.RED}✗ 服务器无法访问{Colors.END}")
            print(f"  建议:")
            print(f"  1. 检查后端服务是否正在运行")
            print(f"  2. 验证URL是否正确: {self.backend_url}")
            print(f"  3. 检查防火墙和网络设置")
            if server_test.details:
                print(f"  错误详情: {server_test.details.get('error', 'N/A')}")
        
        # 检查端点
        endpoint_test = next((r for r in self.results if r.test_name == "端点存在性"), None)
        if endpoint_test and endpoint_test.status == "FAIL":
            print(f"\n{Colors.RED}✗ API端点不存在{Colors.END}")
            print(f"  建议:")
            print(f"  1. 检查后端路由配置")
            print(f"  2. 确认端点路径: {self.chat_endpoint}")
            print(f"  3. 查看后端日志确认路由是否注册")
        
        # 检查认证
        auth_test = next((r for r in self.results if r.test_name == "认证测试"), None)
        if auth_test and auth_test.status == "FAIL":
            print(f"\n{Colors.RED}✗ 认证失败{Colors.END}")
            print(f"  建议:")
            print(f"  1. 检查JWT token是否有效")
            print(f"  2. 确认token未过期")
            print(f"  3. 验证用户权限设置")
        
        # 检查请求格式
        format_tests = [r for r in self.results if "请求格式" in r.test_name]
        passed_formats = [r for r in format_tests if r.status == "PASS"]
        
        if passed_formats:
            print(f"\n{Colors.GREEN}✓ 找到可用的请求格式{Colors.END}")
            for result in passed_formats:
                format_type = result.details.get('format', 'unknown')
                print(f"  推荐使用: {format_type.upper()} 格式")
                if format_type == "direct":
                    print(f"  前端代码示例:")
                    print(f"    const data = {{")
                    print(f"      question: userQuestion,")
                    print(f"      student_id: studentId")
                    print(f"    }}")
                elif format_type == "wrapped":
                    print(f"  前端代码示例:")
                    print(f"    const data = {{")
                    print(f"      data: {{")
                    print(f"        question: userQuestion,")
                    print(f"        student_id: studentId")
                    print(f"      }}")
                    print(f"    }}")
        else:
            print(f"\n{Colors.RED}✗ 所有请求格式都失败{Colors.END}")
            print(f"  建议:")
            print(f"  1. 检查后端API期望的数据格式")
            print(f"  2. 查看后端日志了解具体错误")
            print(f"  3. 确认所有必需字段都已提供")
            
            # 显示详细错误
            for result in format_tests:
                if result.details and 'error' in result.details:
                    print(f"\n  {result.test_name} 错误:")
                    print(f"    {result.details['error']}")
        
        # 检查响应验证
        validation_test = next((r for r in self.results if r.test_name == "响应结构验证"), None)
        if validation_test:
            if validation_test.status == "PASS":
                print(f"\n{Colors.GREEN}✓ 响应结构验证通过{Colors.END}")
                if validation_test.details and 'found_fields' in validation_test.details:
                    fields = validation_test.details['found_fields']
                    print(f"  可用的响应字段: {', '.join(fields)}")
                    print(f"  前端代码建议:")
                    print(f"    const aiMessage = response.{fields[0]}")
                    if len(fields) > 1:
                        print(f"                   || response.{fields[1]}")
            elif validation_test.status == "WARN":
                print(f"\n{Colors.YELLOW}⚠ 响应结构不标准{Colors.END}")
                if validation_test.details:
                    print(f"  可用字段: {validation_test.details.get('available_fields', [])}")
                    print(f"  建议检查后端返回的数据结构")
        
        # 总结
        self.print_section("总结")
        if failed == 0:
            print(f"{Colors.GREEN}✓ 所有测试通过！后端API功能正常{Colors.END}")
        elif server_test and server_test.status == "FAIL":
            print(f"{Colors.RED}✗ 严重问题: 无法连接到后端服务器{Colors.END}")
            print(f"  请先解决服务器连接问题")
        elif endpoint_test and endpoint_test.status == "FAIL":
            print(f"{Colors.RED}✗ 严重问题: API端点不存在{Colors.END}")
            print(f"  请检查后端路由配置")
        elif not passed_formats:
            print(f"{Colors.RED}✗ 严重问题: 无法找到正确的请求格式{Colors.END}")
            print(f"  请检查后端API文档和实现")
        else:
            print(f"{Colors.YELLOW}⚠ 部分测试失败，但基本功能可用{Colors.END}")
            print(f"  请根据上述建议进行修复")


def main():
    parser = argparse.ArgumentParser(
        description='LLM Connection Test Tool - 测试大语言模型API连接',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 基本测试
  python test_llm_connection.py --url http://localhost:1337 --student-id 123
  
  # 带认证的测试
  python test_llm_connection.py --url http://localhost:1337 --token "eyJ..." --student-id 123
  
  # 详细模式
  python test_llm_connection.py --url http://localhost:1337 --student-id 123 --verbose
  
  # 自定义问题
  python test_llm_connection.py --url http://localhost:1337 --student-id 123 --question "测试问题"
        """
    )
    
    parser.add_argument('--url', required=True, help='后端服务器URL (例如: http://localhost:1337)')
    parser.add_argument('--token', help='JWT认证token (可选)')
    parser.add_argument('--student-id', default='123', help='学生ID (默认: 123)')
    parser.add_argument('--question', default='请分析我的学习成果数据', help='测试问题 (默认: 请分析我的学习成果数据)')
    parser.add_argument('--verbose', '-v', action='store_true', help='显示详细日志')
    
    args = parser.parse_args()
    
    # 创建测试器并运行
    tester = LLMConnectionTester(
        backend_url=args.url,
        token=args.token,
        student_id=args.student_id,
        verbose=args.verbose
    )
    
    tester.run_all_tests(question=args.question)


if __name__ == '__main__':
    main()
